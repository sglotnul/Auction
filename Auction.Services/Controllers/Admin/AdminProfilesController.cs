using System.Text.Json;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/admin/profiles")]
[Authorize]
[ServiceFilter(typeof(CheckAdminFilter))]
public class AdminProfilesController : Controller
{
    private readonly AppDbContext _context;

    public AdminProfilesController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Model.Profile>>> GetList([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int perPage = 10)
    {
        var parsedFilter = filter is null ? new Dictionary<string, string>() : JsonSerializer.Deserialize<Dictionary<string, string>>(filter);

        var query = parsedFilter?.ContainsKey("name") ?? false ? _context.Profiles.Where(a => a.FirstName!.Contains(parsedFilter["name"]) || a.LastName!.Contains(parsedFilter["name"])) : _context.Profiles;
        
        var profiles = await query
            .OrderByDescending(a => a.Id)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync();

        var totalCount = await _context.Profiles.CountAsync();
        Response.Headers.Append("Content-Range", $"profiles {(page - 1) * perPage}-{(page - 1) * perPage + profiles.Count - 1}/{totalCount}");

        return Ok(profiles);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Model.Profile>> Get(int id)
    {
        var profile = await _context.Profiles.FindAsync(id);

        if (profile == null)
        {
            return NotFound();
        }

        return profile;
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Model.Profile>> Put(int id, [FromBody] Model.Profile profile)
    {
        if (id != profile.Id)
        {
            return BadRequest();
        }

        profile.BirthDate = profile.BirthDate?.ToUniversalTime();
        
        _context.Entry(profile).State = EntityState.Modified;

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

        return profile;
    }
    
    [HttpPost]
    public async Task<ActionResult<Model.Profile>> Post([FromBody] Model.Profile profile)
    {
        profile.BirthDate = profile.BirthDate?.ToUniversalTime();
        
        _context.Profiles.Add(profile);
        await _context.SaveChangesAsync();

        return profile;
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var profile = await _context.Profiles.FindAsync(id);
        if (profile == null)
        {
            return NotFound();
        }

        _context.Profiles.Remove(profile);
        await _context.SaveChangesAsync();

        return Ok(new {id});
    }

    private bool Exists(int id)
    {
        return _context.Profiles.Any(e => e.Id == id);
    }
}
