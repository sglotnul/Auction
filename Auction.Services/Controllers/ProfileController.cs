using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

[Route("api/profiles")]
[Authorize]
public class ProfileController : ControllerBase
{
	private readonly UserManager<User> _userManager;

	public ProfileController(UserManager<User> userManager, IErrorCodeResolver errorCodeResolver) : base(errorCodeResolver)
	{
		_userManager = userManager;
	}
	
	[HttpGet("")]
	public async Task<IActionResult> GetUserProfileAsync()
	{
		var user = await _userManager.GetUserAsync(HttpContext.User);
		if (user is null)
			throw new InvalidDataException("Authorized user not found.");

		if (user.ProfileId is null)
			return ErrorCode(ErrorCodes.NotFound);

		return Json(user.Profile);
	}
	
	[HttpGet("{userName}")]
	public async Task<IActionResult> GetUserProfileAsync(string userName)
	{
		var user = await _userManager.FindByNameAsync(userName);

		if (user?.ProfileId is null)
			return ErrorCode(ErrorCodes.NotFound);

		return Json(user.Profile);
	}
}