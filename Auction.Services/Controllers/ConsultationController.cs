using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/consultations")]
public class ConsultationController : ControllerBase
{
	private readonly AppDbContext _dbContext;
	private readonly UserManager<User> _userManager;

	public ConsultationController(
		AppDbContext dbContext,
		UserManager<User> userManager,
		IErrorCodeResolver errorCodeResolver) : base(errorCodeResolver)
	{
		_dbContext = dbContext;
		_userManager = userManager;
	}

	[HttpGet]
	[Authorize]
	public async Task<IActionResult> GetConsultationsAsync()
	{
		var userId = _userManager.GetUserId(HttpContext.User);
		if (userId is null)
			throw new InvalidDataException("Authorized user id is null.");

		var consultations = await _dbContext.Consultations
			.Where(c => c.StudentId == userId || c.StudentId == userId)
			.Select(c => new ConsultationResponse
			{
				Id = c.Id,
				StartAt = c.StartAt,
				Status = c.Status,
				Consultant = new UserResponse
				{
					UserId = c.ConsultantId,
					UserName = c.Consultant.UserName!,
					Profile = c.Consultant.Profile != null
						? new ProfileResponse
						{
							FirstName = c.Consultant.Profile.FirstName,
							LastName = c.Consultant.Profile.LastName
						}
						: null
				},
				Student = new UserResponse
				{
					UserId = c.StudentId,
					UserName = c.Student.UserName!,
					Profile = c.Student.Profile != null
						? new ProfileResponse
						{
							FirstName = c.Student.Profile.FirstName,
							LastName = c.Student.Profile.LastName
						}
						: null
				},
				Auction = new AuctionResponse
				{
					Id = c.AuctionId,
					Title = c.Auction.Title,
				},
				Bid = new BidResponse
				{
					Amount = c.Bid.Amount,
					Comment = c.Bid.Comment
				}
			})
			.ToArrayAsync();

		var result = new ConsultationsResponse
		{
			Consultations = consultations
		};

		return Json(result);
	}
}