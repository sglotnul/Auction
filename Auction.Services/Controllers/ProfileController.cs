using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/profiles")]
[Authorize]
public class ProfileController : ControllerBase
{
	private readonly UserManager<User> _userManager;
	private readonly AppDbContext _context;

	public ProfileController(
		UserManager<User> userManager,
		AppDbContext context,
		IErrorCodeResolver errorCodeResolver) : base(errorCodeResolver)
	{
		_userManager = userManager;
		_context = context;
	}
	
	[HttpGet("")]
	public async Task<IActionResult> GetUserProfileAsync()
	{
		var user = await _userManager.GetUserAsync(HttpContext.User);
		if (user is null)
			throw new InvalidDataException("Authorized user not found.");

		if (user.ProfileId is null)
			return ErrorCode(ErrorCodes.NotFound);

		return Json(await _context.Profiles.SingleOrDefaultAsync(p => p.Id == user.ProfileId));
	}
	
	[HttpGet("{userName}")]
	public async Task<IActionResult> GetUserProfileAsync(string userName)
	{
		var user = await _userManager.FindByNameAsync(userName);

		if (user?.ProfileId is null)
			return ErrorCode(ErrorCodes.NotFound);

		return Json(user.Profile);
	}
	
	[HttpPut("")]
	public async Task<IActionResult> EditUserProfileAsync([FromBody] ProfileRequest profileRequest)
	{
		var user = await _userManager.GetUserAsync(HttpContext.User);
		if (user is null)
			throw new InvalidDataException("Authorized user not found.");

		await _context.AddOrUpdateAsync(
			c => c.Profiles,
			p => p.Id == user.ProfileId,
			new Profile
			{
				FirstName = profileRequest.FirstName?.Trim(),
				LastName = profileRequest.LastName?.Trim(),
				BirthDate = profileRequest.BirthDate?.Date,
				Biography = profileRequest.Biography?.Trim(),
				Education = profileRequest.Education?.Trim()
			});

		return Json(await _context.Profiles.SingleOrDefaultAsync(p => p.Id == user.ProfileId));
	}
}