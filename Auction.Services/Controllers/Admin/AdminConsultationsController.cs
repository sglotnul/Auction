using System.Text.Json;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/admin/consultations")]
[Authorize]
[ServiceFilter(typeof(CheckAdminFilter))]
public class AdminConsultationsController : Controller
{
    private readonly AppDbContext _context;

    public AdminConsultationsController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Model.Consultation>>> GetList([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int perPage = 10)
    {
        var parsedFilter = filter is null ? new Dictionary<string, int>() : JsonSerializer.Deserialize<Dictionary<string, int>>(filter);

        var query = parsedFilter?.ContainsKey("auctionId") ?? false ? _context.Consultations.Where(a => a.AuctionId == parsedFilter["auctionId"]) : _context.Consultations;
        
        var consultations = await query
            .OrderByDescending(a => a.Id)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .AsNoTracking()
            .ToListAsync();

        var totalCount = await _context.Consultations.CountAsync();
        Response.Headers.Append("Content-Range", $"consultations {(page - 1) * perPage}-{(page - 1) * perPage + consultations.Count - 1}/{totalCount}");

        return Ok(consultations);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Model.Consultation>> Get(int id)
    {
        var consultation = await _context.Consultations.FindAsync(id);

        if (consultation == null)
        {
            return NotFound();
        }

        return consultation;
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Model.Consultation>> Put(int id, [FromBody] Model.Consultation consultation)
    {
        if (id != consultation.Id)
        {
            return BadRequest();
        }

        consultation.StartAt = consultation.StartAt.ToUniversalTime();

        _context.Entry(consultation).State = EntityState.Modified;

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

        return consultation;
    }
    
    [HttpPost]
    public async Task<ActionResult<Model.Consultation>> Post([FromBody] Model.Consultation consultation)
    {
        consultation.StartAt = consultation.StartAt.ToUniversalTime();
        
        _context.Consultations.Add(consultation);
        await _context.SaveChangesAsync();

        return consultation;
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var consultation = await _context.Consultations.FindAsync(id);
        if (consultation == null)
        {
            return NotFound();
        }

        _context.Consultations.Remove(consultation);
        await _context.SaveChangesAsync();

        return Ok(new {id});
    }

    private bool Exists(int id)
    {
        return _context.Consultations.Any(e => e.Id == id);
    }
}
