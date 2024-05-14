using System.Security.Claims;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/auctions")]
public class AuctionController : ControllerBase
{
	private readonly AppDbContext _dbContext;

	public AuctionController(AppDbContext dbContext, IErrorCodeResolver errorCodeResolver) : base(errorCodeResolver)
	{
		_dbContext = dbContext;
	}
	
	[HttpGet("")]
	public async Task<IActionResult> GetAuctionsAsync([FromQuery] AuctionsRequest request)
	{
		var auctions = _dbContext.Auctions.AsQueryable();

		if (request.Categories is not null && request.Categories.Count != 0)
		{
			auctions = _dbContext.AuctionCategories
				.Where(ac => request.Categories.Contains(ac.CategoryId))
				.Select(ac => ac.Auction)
				.Distinct();
		}

		auctions = auctions.Where(a => a.Status == AuctionStatus.Active).Include(a => a.StudentUser.Profile);

		var result = new AuctionsResponse
		{
			Auctions = await auctions.ToArrayAsync()
		};
		
		return Json(result);
	}
	
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetAuctionsAsync(int id)
	{
		var auction = await _dbContext.Auctions.Include(a => a.StudentUser.Profile).SingleOrDefaultAsync(a => a.Id == id);
		if (auction is null)
			return ErrorCode(ErrorCodes.NotFound);
		
		return Json(auction);
	}
	
	[HttpGet("user")]
	[Authorize]
	public async Task<IActionResult> GetCurrentsAuctionsAsync()
	{
		var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

		var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId);
		if (user is null)
			throw new InvalidDataException($"User with Id={userId} not found.");

		if (user.Role is not Role.Student and not Role.Admin)
			return Forbid();

		return Json(await _dbContext.Auctions.Where(a => a.StudentUserId == userId).ToArrayAsync());
	}

	[HttpPost("create")]
	[Authorize]
	public async Task<IActionResult> CreateAuctionAsync()
	{
		var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

		var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId);
		if (user is null)
			throw new InvalidDataException($"User with Id={userId} not found.");

		if (user.Role is not Role.Student and not Role.Admin)
			return Forbid();

		var auction = new Model.Auction
		{
			StudentUserId = userId!
		};

		await _dbContext.Auctions.AddAsync(auction);
		await _dbContext.SaveChangesAsync();

		return Ok();
	}
	
	[HttpPost("{id:int}/bid")]
	[Authorize]
	public async Task<IActionResult> PlaceBidAsync([FromRoute] int id)
	{
		if (!await _dbContext.Auctions.AnyAsync(a => a.Id == id))
			return ErrorCode(ErrorCodes.NotFound);

		var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
		
		var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId);
		if (user is null)
			throw new InvalidDataException($"User with Id={userId} not found.");
		
		if (user.Role is not Role.Consultant and not Role.Admin)
			return Forbid();

		var bid = new ConsultantBid
		{
			AuctionId = id,
			ConsultantUserId = userId!
		};

		await _dbContext.ConsultantBids.AddAsync(bid);
		await _dbContext.SaveChangesAsync();

		return Ok();
	}
}