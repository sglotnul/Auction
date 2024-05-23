using Auction.Model;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class CheckAdminFilter : IAsyncActionFilter
{
	private readonly UserManager<User> _userManager;

	public CheckAdminFilter(UserManager<User> userManager)
	{
		_userManager = userManager;
	}

	public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
	{
		var user = await _userManager.GetUserAsync(context.HttpContext.User);
		if (user?.Role != Role.Admin)
		{
			context.Result = new UnauthorizedResult();
			return;
		}

		await next.Invoke();
	}
}