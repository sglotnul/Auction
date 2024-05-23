using System.Text.Json;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/admin/bids")]
[Authorize]
[ServiceFilter(typeof(CheckAdminFilter))]
public class AdminBidsController : Controller
{
    private readonly AppDbContext _context;

    public AdminBidsController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Model.Bid>>> GetList([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int perPage = 10)
    {
        var parsedFilter = filter is null ? new Dictionary<string, string>() : JsonSerializer.Deserialize<Dictionary<string, string>>(filter);

        var query = parsedFilter?.ContainsKey("userId") ?? false ? _context.Bids.Where(a => a.UserId.Contains(parsedFilter["userId"])) : _context.Bids;
        
        var bids = await query
            .OrderByDescending(a => a.Id)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync();

        var totalCount = await _context.Bids.CountAsync();
        Response.Headers.Append("Content-Range", $"bids {(page - 1) * perPage}-{(page - 1) * perPage + bids.Count - 1}/{totalCount}");

        return Ok(bids);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Model.Bid>> Get(int id)
    {
        var bid = await _context.Bids.FindAsync(id);

        if (bid == null)
        {
            return NotFound();
        }

        return bid;
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Model.Bid>> Put(int id, [FromBody] Model.Bid bid)
    {
        if (id != bid.Id)
        {
            return BadRequest();
        }

        bid.DateTime = bid.DateTime.ToUniversalTime();

        _context.Entry(bid).State = EntityState.Modified;

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

        return bid;
    }
    
    [HttpPost]
    public async Task<ActionResult<Model.Bid>> Post([FromBody] Model.Bid bid)
    {
        bid.DateTime = bid.DateTime.ToUniversalTime();
        
        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();

        return bid;
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var bid = await _context.Bids.FindAsync(id);
        if (bid == null)
        {
            return NotFound();
        }

        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync();

        return Ok(new {id});
    }

    private bool Exists(int id)
    {
        return _context.Bids.Any(e => e.Id == id);
    }
}
