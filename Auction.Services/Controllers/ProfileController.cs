using System.Security.Claims;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/profile")]
[Authorize]
public class ProfileController : Controller
{
	private readonly AppDbContext _dbContext;

	public ProfileController(AppDbContext dbContext)
	{
		_dbContext = dbContext;
	}
	
	[HttpGet("")]
	public async Task<IActionResult> GetUsersProfileAsync()
	{
		var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
		
		var profile = await _dbContext.Profiles.SingleOrDefaultAsync(p => p.UserId == userId);
		if (profile is null)
			throw new InvalidDataException();

		var response = new ProfileResponseDto(profile.Id);

		return Json(response);
	}
}