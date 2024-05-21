using System.Data;
using System.Diagnostics.CodeAnalysis;
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
		
		var shift = TimeSpan.FromMinutes(2);
		var currentDateTime = DateTime.UtcNow + shift;

		var result = await auctions
			.Where(a => a.EndAt > currentDateTime)
			.OrderBy(a => a.EndAt)
			.Select(a => new AuctionResponse
			{
				Id = a.Id,
				Title = a.Title,
				Description = a.Description,
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
	public async Task<IActionResult> GetAuctionsForUserAsync(string userName)
	{
		var user = await _userManager.FindByNameAsync(userName);
		if (user is null)
			return ErrorCode(ErrorCodes.NotFound);
		
		var result = await _dbContext.Auctions
			.Where(a => a.User.UserName == userName)
			.OrderBy(a => a.EndAt)
			.Select(a => new AuctionResponse
			{
				Id = a.Id,
				Title = a.Title,
				Description = a.Description,
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
				MinDecrease = a.MinDecrease,
				InitialPrice = a.InitialPrice,
				StartAt = a.StartAt,
				EndAt = a.EndAt,
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
			.SingleOrDefaultAsync(a => a.Id == id);
		
		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);
		
		var userId = _userManager.GetUserId(HttpContext.User);
		if (userId != auction.User.UserId && auction.EndAt <= DateTime.UtcNow)
			return ErrorCode(ErrorCodes.NotFound);
		
		return Json(auction);
	}

	[HttpPost("create")]
	[Authorize]
	public async Task<IActionResult> CreateAuctionAsync([FromBody] AuctionCreateRequest request)
	{
		var user = await _userManager.GetUserAsync(HttpContext.User);
		if (user is null)
			throw new InvalidDataException("Authorized user not found.");

		if (user.Role is not Role.Student and not Role.Admin)
			return ErrorCode(ErrorCodes.InvalidRole);

		var categories = await _dbContext.Categories.Where(c => request.Categories.Contains(c.Id)).ToListAsync();
		
		var auction = new Model.Auction
		{
			Id = 0,
			Title = request.Title,
			Description = request.Description,
			MinDecrease = 100, //TODO: fix
			InitialPrice = 1000, //TODO: fix
			Categories = categories
		};

		user.Auctions.Add(auction);
		await _dbContext.SaveChangesAsync();

		return Ok(auction.Id);
	}
	
	[HttpPut("{id:int}/launch")]
	[Authorize]
	public async Task<IActionResult> LaunchAuctionAsync([FromRoute] int id, [FromBody] AuctionLaunchRequest request)
	{
		var userId = _userManager.GetUserId(HttpContext.User);
		if (userId is null)
			throw new InvalidDataException("Authorized user id is null.");

		var auction = await _dbContext.Auctions.Include(a => a.Categories).SingleOrDefaultAsync(a => a.Id == id);
		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);

		if (auction.UserId != userId)
			return ErrorCode(ErrorCodes.Forbidden);

		if (auction.StartAt is not null)
			return ErrorCode(ErrorCodes.AuctionAlreadyStarted);

		if (request.Period.Ticks <= 0)
			return ErrorCode(ErrorCodes.InvalidLaunchPeriod);

		var currentDateTimeUtc = DateTime.UtcNow;
		auction.StartAt = currentDateTimeUtc;
		auction.EndAt = currentDateTimeUtc + request.Period;
		
		_dbContext.Update(auction);
		await _dbContext.SaveChangesAsync();

		return Ok();
	}
	
	[HttpPut("{id:int}")]
	[Authorize]
	public async Task<IActionResult> EditAuctionAsync([FromRoute] int id, [FromBody] AuctionCreateRequest request)
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

		return Ok();
	}
	
	[HttpPost("{id:int}/bid")]
	[Authorize]
	public async Task<IActionResult> PlaceBidAsync([FromRoute] int id, [FromBody] BidRequest request)
	{
		if (request.Amount < 0)
			return ErrorCode(ErrorCodes.InvalidBid);
		
		var user = await _userManager.GetUserAsync(HttpContext.User);
		
		if (user is null)
			throw new InvalidDataException("Authorized user id is null.");

		if (user.Role is not Role.Consultant and not Role.Admin)
			return ErrorCode(ErrorCodes.InvalidRole);

		var auction = await _dbContext.Auctions.SingleOrDefaultAsync(a => a.Id == id);
		
		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);
		
		if (user.Id == auction.UserId)
			return ErrorCode(ErrorCodes.Forbidden);

		await using var transaction = await _dbContext.Database.BeginTransactionAsync(IsolationLevel.Serializable);

		try
		{
			var actualBid = _dbContext.Bids.Where(b => b.AuctionId == auction.Id).OrderBy(b => b.Amount).FirstOrDefault();

			var actualPrice = actualBid?.Amount is null
				? auction.InitialPrice
				: Math.Min(auction.InitialPrice, actualBid.Amount);
			
			if (actualPrice - request.Amount < auction.MinDecrease)
			{
				await transaction.RollbackAsync();
				return ErrorCode(ErrorCodes.InvalidBid);
			}

			var bid = new Bid
			{
				UserId = user.Id,
				Amount = request.Amount,
				DateTime = DateTime.UtcNow,
				Comment = request.Comment
			};
	
			auction.Bids.Add(bid);
			await _dbContext.SaveChangesAsync();
			
			await transaction.CommitAsync();

			return Ok();
		}
		catch
		{
			await transaction.RollbackAsync();
			throw;
		}
	}
	
	[HttpGet("{id:int}/bids")]
	public async Task<IActionResult> GetBidsAsync([FromRoute] int id)
	{
		var bids = await _dbContext.Bids
			.Include(b => b.User.Profile)
			.Where(b => b.AuctionId == id)
			.Select(b => new BidResponse
			{
				Amount = b.Amount,
				Comment = b.Comment,
				User = new UserResponse
				{
					UserId = b.UserId,
					UserName = b.User.UserName!,
					Role = b.User.Role,
					Profile = b.User.Profile
				},
				DateTime = b.DateTime
			})
			.OrderBy(b => b.Amount)
			.AsNoTracking()
			.ToArrayAsync();

		var result = new BidsResponse
		{
			Bids = bids,
			CurrentPrice = bids.MinBy(b => b.Amount)?.Amount
		};

		return Json(result);
	}
}