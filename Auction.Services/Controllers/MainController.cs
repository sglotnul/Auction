using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

public class MainController
{
	[Route("{*url}", Order = int.MaxValue)]
	public Task<IActionResult> IndexAsync()
	{
		throw new NotImplementedException();
	}
}