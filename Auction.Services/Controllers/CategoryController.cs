using Auction.Model;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/categories")]
public class CategoryController : Controller
{
	private readonly AppDbContext _dbContext;

	public CategoryController(AppDbContext dbContext)
	{
		_dbContext = dbContext;
	}
	
	[HttpGet("")]
	public async Task<IActionResult> GetCategoriesAsync()
	{
		var result = await _dbContext.Categories
			.Select(c => new CategoryResponse
			{
				Id = c.Id,
				Name = c.Name
			})
			.ToArrayAsync();
		
		return Json(result);
	}
}