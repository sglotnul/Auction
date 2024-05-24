using Auction.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/profiles")]
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

	[HttpGet("{userName}")]
	public async Task<IActionResult> GetUserProfileAsync(string userName)
	{
		var user = await _userManager.FindByNameAsync(userName);
		if (user is null)
			return ErrorCode(ErrorCodes.NotFound);

		var profile = await _context.Profiles.SingleOrDefaultAsync(p => p.UserId == user.Id);

		if (profile is null)
			return Json(new {});

		var result = new ProfileResponse
		{
			Id = profile.Id,
			FirstName = profile.FirstName,
			LastName = profile.LastName,
			BirthDate = profile.BirthDate,
			Biography = profile.Biography,
			Education = profile.Education
		};

		return Json(result);
	}
	
	[HttpPut("")]
	[Authorize]
	public async Task<IActionResult> EditUserProfileAsync([FromBody] ProfileRequest profileRequest)
	{
		var user = await _userManager.GetUserAsync(HttpContext.User);
		if (user is null)
			throw new InvalidDataException("Authorized user not found.");

		var newProfile = new Profile
		{
			UserId = user.Id,
			FirstName = profileRequest.FirstName?.Trim(),
			LastName = profileRequest.LastName?.Trim(),
			BirthDate = profileRequest.BirthDate?.Date,
			Biography = profileRequest.Biography?.Trim(),
			Education = profileRequest.Education?.Trim()
		};
		
		var profile = await _context.AddOrUpdateAsync(
			c => c.Profiles,
			p => p.UserId == user.Id,
			newProfile);
		
		var result = new ProfileResponse
		{
			Id = profile.Id,
			FirstName = profile.FirstName,
			LastName = profile.LastName,
			BirthDate = profile.BirthDate,
			Biography = profile.Biography,
			Education = profile.Education
		};
		
		return Json(result);
	}
}