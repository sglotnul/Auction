using Auction.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/auctions")]
public class AuctionController : ControllerBase
{
	private readonly UserManager<User> _userManager;
	private readonly AppDbContext _dbContext;

	public AuctionController(
		UserManager<User> userManager,
		AppDbContext dbContext,
		IErrorCodeResolver errorCodeResolver) : base(errorCodeResolver)
	{
		_userManager = userManager;
		_dbContext = dbContext;
	}
	
	[HttpGet("")]
	public async Task<IActionResult> GetAuctionsForListAsync([FromQuery] AuctionsRequest request)
	{
		var auctions = _dbContext.Auctions.AsQueryable();

		if (request.Categories is not null && request.Categories.Count != 0)
		{
			auctions = auctions.Where(a => a.Categories.Any(ac => request.Categories.Contains(ac.Id)));
		}

		var userId = _userManager.GetUserId(HttpContext.User);
		if (userId is not null)
		{
			auctions = auctions.Where(a => a.StudentUserId != userId);
		}
		
		var result = await auctions
			.Where(a => a.Status == AuctionStatus.Active)
			.Select(a => new
			{
				a.Id,
				a.Name,
				a.Description,
				a.Status,
				a.StudentUser,
				Categories = a.Categories.Select(c => new Category
				{
					Id = c.Id,
					Name = c.Name
				})
			})
			.AsNoTracking()
			.ToArrayAsync();

		return Json(new AuctionsResponse
		{
			Auctions = result
				.Select(a => new AuctionResponse(
					a.Id,
					a.Name,
					a.Description,
					a.Status,
					new UserResponse
					{
						UserId = a.StudentUser.Id,
						UserName = a.StudentUser.UserName!,
						Profile = a.StudentUser.Profile
					},
					a.Categories.ToArray()))
				.ToArray()
		});
	}
	
	[HttpGet("user/{userName}")]
	public async Task<IActionResult> GetAuctionsForListAsync(string userName)
	{
		var result = await _dbContext.Auctions
			.Where(a => a.StudentUser.UserName == userName)
			.Select(a => new
			{
				a.Id,
				a.Name,
				a.Description,
				a.Status,
				a.StudentUser,
				Categories = a.Categories.Select(c => new Category
				{
					Id = c.Id,
					Name = c.Name
				})
			})
			.AsNoTracking()
			.ToArrayAsync();

		return Json(new AuctionsResponse
		{
			Auctions = result
				.Select(a => new AuctionResponse(
					a.Id,
					a.Name,
					a.Description,
					a.Status,
					new UserResponse
					{
						UserId = a.StudentUser.Id,
						UserName = a.StudentUser.UserName!,
						Profile = a.StudentUser.Profile
					},
					a.Categories.ToArray()))
				.ToArray()
		});
	}
	
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetAuctionAsync(int id)
	{
		var auction = await _dbContext.Auctions
			.Select(a => new
			{
				a.Id,
				a.Name,
				a.Description,
				a.Status,
				a.StudentUser,
				Categories = a.Categories.Select(c => new Category
				{
					Id = c.Id,
					Name = c.Name
				})
			})
			.SingleOrDefaultAsync(a => a.Id == id);

		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);
		
		return Json(new AuctionResponse(
			auction.Id,
			auction.Name,
			auction.Description,
			auction.Status,
			new UserResponse
			{
				UserId = auction.StudentUser.Id,
				UserName = auction.StudentUser.UserName!,
				Profile = auction.StudentUser.Profile
			},
			auction.Categories.ToArray()));
	}

	[HttpPost("create")]
	[Authorize]
	public async Task<IActionResult> CreateAuctionAsync([FromBody] CreateAuctionRequest request)
	{
		var user = await _userManager.GetUserAsync(HttpContext.User);
		if (user is null)
			throw new InvalidDataException("Authorized user not found.");

		if (user.Role is not Role.Student and not Role.Admin)
			return ErrorCode(ErrorCodes.InvalidRole);

		var categories = await _dbContext.Categories.Where(c => request.Categories.Contains(c.Id)).ToListAsync();
		
		var auction = new Model.Auction
		{
			Name = request.Title,
			Description = request.Description,
			Status = AuctionStatus.Active,
			StudentUserId = user.Id,
			Categories = categories
		};

		await _dbContext.Auctions.AddAsync(auction);
		await _dbContext.SaveChangesAsync();

		return Ok(auction.Id);
	}
	
	[HttpPut("{id:int}")]
	[Authorize]
	public async Task<IActionResult> EditAuctionAsync([FromRoute] int id, [FromBody] CreateAuctionRequest request)
	{
		var userId = _userManager.GetUserId(HttpContext.User);
		if (userId is null)
			throw new InvalidDataException("Authorized user id is null.");

		var auction = await _dbContext.Auctions.SingleOrDefaultAsync(a => a.Id == id);
		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);

		if (auction.StudentUserId != userId)
			return ErrorCode(ErrorCodes.Forbidden);
		
		var categories = await _dbContext.Categories.Where(c => request.Categories.Contains(c.Id)).ToListAsync();
		
		auction.Name = request.Title;
		auction.Description = request.Description;
		auction.Categories = categories;

		_dbContext.Update(auction);
		await _dbContext.SaveChangesAsync();

		return Ok(auction.Id);
	}
	
	[HttpPost("{id:int}/bid")]
	[Authorize]
	public async Task<IActionResult> PlaceBidAsync([FromRoute] int id, [FromBody] BidRequest request)
	{
		var auction = await _dbContext.Auctions.SingleOrDefaultAsync(a => a.Id == id);
		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);
		
		var user = await _userManager.GetUserAsync(HttpContext.User);
		if (user is null)
			throw new InvalidDataException("Authorized user id is null.");

		if (user.Role is not Role.Consultant and not Role.Admin)
			return ErrorCode(ErrorCodes.InvalidRole);
		
		if (user.Id == auction.StudentUserId)
			return ErrorCode(ErrorCodes.Forbidden);

		var bid = new ConsultantBid
		{
			AuctionId = id,
			ConsultantUserId = user.Id!,
			Amount = request.Amount,
			DateTime = DateTime.Now,
			Comment = request.Comment
		};

		await _dbContext.ConsultantBids.AddAsync(bid);
		await _dbContext.SaveChangesAsync();

		return Ok();
	}
}