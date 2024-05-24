using System.Text.Json;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/admin/auctions")]
[Authorize]
[ServiceFilter(typeof(CheckAdminFilter))]
public class AdminAuctionsController : Controller
{
    private readonly AppDbContext _context;

    public AdminAuctionsController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Model.Auction>>> GetList([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int perPage = 10)
    {
        var parsedFilter = filter is null ? new Dictionary<string, string>() : JsonSerializer.Deserialize<Dictionary<string, string>>(filter);

        var query = parsedFilter?.ContainsKey("title") ?? false ? _context.Auctions.Where(a => a.Title.Contains(parsedFilter["title"])) : _context.Auctions;
        
        var auctions = await query
            .OrderByDescending(a => a.Id)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .AsNoTracking()
            .ToListAsync();

        var totalCount = await _context.Auctions.CountAsync();
        Response.Headers.Append("Content-Range", $"auctions {(page - 1) * perPage}-{(page - 1) * perPage + auctions.Count - 1}/{totalCount}");

        return Ok(auctions);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Model.Auction>> Get(int id)
    {
        var auction = await _context.Auctions.AsNoTracking().SingleOrDefaultAsync(a => a.Id == id);

        if (auction == null)
        {
            return NotFound();
        }

        return auction;
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Model.Auction>> Put(int id, [FromBody] Model.Auction auction)
    {
        if (id != auction.Id)
        {
            return BadRequest();
        }
        
        auction.StartAt = auction.StartAt?.ToUniversalTime();
        auction.EndAt = auction.EndAt?.ToUniversalTime();

        _context.Entry(auction).State = EntityState.Modified;

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

        return auction;
    }
    
    [HttpPost]
    public async Task<ActionResult<Model.Auction>> Post([FromBody] Model.Auction auction)
    {
        auction.StartAt = auction.StartAt?.ToUniversalTime();
        auction.EndAt = auction.EndAt?.ToUniversalTime();
        
        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();

        return auction;
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var auction = await _context.Auctions.FindAsync(id);
        if (auction == null)
        {
            return NotFound();
        }

        _context.Auctions.Remove(auction);
        await _context.SaveChangesAsync();

        return Ok(new {id});
    }

    private bool Exists(int id)
    {
        return _context.Auctions.Any(e => e.Id == id);
    }
}
