using System.Text.Json;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/admin/categories")]
[Authorize]
[ServiceFilter(typeof(CheckAdminFilter))]
public class AdminCategoriesController : Controller
{
    private readonly AppDbContext _context;

    public AdminCategoriesController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Model.Category>>> GetList([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int perPage = 10)
    {
        var parsedFilter = filter is null ? new Dictionary<string, string>() : JsonSerializer.Deserialize<Dictionary<string, string>>(filter);

        var query = parsedFilter?.ContainsKey("name") ?? false ? _context.Categories.Where(a => a.Name.Contains(parsedFilter["name"])) : _context.Categories;
        
        var categories = await query
            .OrderByDescending(a => a.Id)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync();

        var totalCount = await _context.Categories.CountAsync();
        Response.Headers.Append("Content-Range", $"categories {(page - 1) * perPage}-{(page - 1) * perPage + categories.Count - 1}/{totalCount}");

        return Ok(categories);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Model.Category>> Get(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        return category;
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Model.Category>> Put(int id, [FromBody] Model.Category category)
    {
        if (id != category.Id)
        {
            return BadRequest();
        }

        _context.Entry(category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!Exists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return category;
    }
    
    [HttpPost]
    public async Task<ActionResult<Model.Category>> Post([FromBody] Model.Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return category;
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound();
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok(new {id});
    }

    private bool Exists(int id)
    {
        return _context.Categories.Any(e => e.Id == id);
    }
}
