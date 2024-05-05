using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

public class HomeController : Controller
{
	[Route("{*url}", Order = int.MaxValue)]
	public IActionResult Index()
	{
		return View();
	}
}