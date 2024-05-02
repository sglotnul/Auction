using System.Security.Claims;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("auctions")]
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
	
	[HttpGet("im")]
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
}