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

		if (user?.ProfileId is null)
			return Json(new {});

		var profile = await _context.Profiles.SingleOrDefaultAsync(p => p.Id == user.ProfileId)
			?? throw new InvalidOperationException();

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
			Id = user.ProfileId ?? default,
			FirstName = profileRequest.FirstName?.Trim(),
			LastName = profileRequest.LastName?.Trim(),
			BirthDate = profileRequest.BirthDate?.Date,
			Biography = profileRequest.Biography?.Trim(),
			Education = profileRequest.Education?.Trim()
		};

		await using var transaction = await _context.Database.BeginTransactionAsync();
		try
		{
			await _context.AddOrUpdateAsync(
				c => c.Profiles,
				p => p.Id == user.ProfileId,
				newProfile);

			user.ProfileId = newProfile.Id;
			var result = await _userManager.UpdateAsync(user);
			
			if (!result.Succeeded)
			{
				await transaction.RollbackAsync();
				return ErrorCode(result.Errors.FirstOrDefault()?.Code ?? throw new InvalidOperationException());
			}

			await transaction.CommitAsync();
			return Json(await _context.Profiles.SingleOrDefaultAsync(p => p.Id == user.ProfileId));
		}
		catch
		{
			await transaction.RollbackAsync();
			throw; 
		}
	}
}