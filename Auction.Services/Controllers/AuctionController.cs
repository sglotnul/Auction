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
			auctions = auctions.Where(a => a.UserId != userId);
		}
		
		var result = await auctions
			.Where(a => a.Status == AuctionStatus.Active)
			.Select(a => new AuctionResponse
			{
				Id = a.Id,
				Title = a.Title,
				Description = a.Description,
				Status = a.Status,
				User = new UserResponse
				{
					UserId = a.User.Id,
					UserName = a.User.UserName!,
					Profile = a.User.Profile
				},
				Categories = a.Categories
					.Select(
						c => new CategoryResponse
						{
							Id = c.Id,
							Name = c.Name
						})	
					.ToArray()
			})
			.AsNoTracking()
			.ToArrayAsync();

		return Json(new AuctionsResponse
		{
			Auctions = result
		});
	}
	
	[HttpGet("user/{userName}")]
	public async Task<IActionResult> GetAuctionsForListAsync(string userName)
	{
		var result = await _dbContext.Auctions
			.Where(a => a.User.UserName == userName)
			.Select(a => new AuctionResponse
			{
				Id = a.Id,
				Title = a.Title,
				Description = a.Description,
				Status = a.Status,
				User = new UserResponse
				{
					UserId = a.User.Id,
					UserName = a.User.UserName!,
					Profile = a.User.Profile
				},
				Categories = a.Categories
					.Select(
						c => new CategoryResponse
						{
							Id = c.Id,
							Name = c.Name
						})	
					.ToArray()
			})
			.AsNoTracking()
			.ToArrayAsync();

		return Json(new AuctionsResponse
		{
			Auctions = result
		});
	}
	
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetAuctionAsync(int id)
	{
		var auction = await _dbContext.Auctions
			.Select(a => new AuctionResponse
			{
				Id = a.Id,
				Title = a.Title,
				Description = a.Description,
				Status = a.Status,
				User = new UserResponse
				{
					UserId = a.User.Id,
					UserName = a.User.UserName!,
					Profile = a.User.Profile
				},
				Categories = a.Categories
					.Select(
						c => new CategoryResponse
						{
							Id = c.Id,
							Name = c.Name
						})	
					.ToArray()
			})
			.SingleOrDefaultAsync(a => a.Id == id);

		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);
		
		return Json(auction);
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
			Title = request.Title,
			Description = request.Description,
			Status = AuctionStatus.Active,
			Categories = categories
		};

		user.Auctions.Add(auction);
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

		var auction = await _dbContext.Auctions.Include(a => a.Categories).SingleOrDefaultAsync(a => a.Id == id);
		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);

		if (auction.UserId != userId)
			return ErrorCode(ErrorCodes.Forbidden);
		
		var categories = await _dbContext.Categories.Where(c => request.Categories.Contains(c.Id)).Distinct().ToListAsync();
		
		auction.Title = request.Title;
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
		
		if (user.Id == auction.UserId)
			return ErrorCode(ErrorCodes.Forbidden);

		var bid = new Bid
		{
			UserId = user.Id,
			Amount = request.Amount,
			DateTime = DateTime.UtcNow,
			Comment = request.Comment
		};
		
		auction.Bids.Add(bid);
		await _dbContext.SaveChangesAsync();

		return Ok();
	}
}