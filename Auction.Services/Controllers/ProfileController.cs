using System.Security.Claims;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/profiles")]
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
		var user = await _dbContext.Users.Include(user => user.Profile).SingleOrDefaultAsync(user => user.Id == userId);
		
		if (user is null)
			throw new InvalidDataException($"User with Id={userId} not found.");

		return Json(new ProfileResponseDto(user.Profile?.Id));
	}
}