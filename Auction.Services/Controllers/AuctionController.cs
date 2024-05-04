using System.Security.Claims;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/auctions")]
public class AuctionController : Controller
{
	private readonly AppDbContext _dbContext;

	public AuctionController(AppDbContext dbContext)
	{
		_dbContext = dbContext;
	}
	
	[HttpGet("")]
	public async Task<IActionResult> GetAuctionsAsync()
	{
		return Json(await _dbContext.Auctions.ToArrayAsync());
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
			return NotFound();

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