using System.Text.Json;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api/admin/users")]
[Authorize]
[ServiceFilter(typeof(CheckAdminFilter))]
public class AdminUsersController : Controller
{
    private readonly UserManager<User> _userManager;

    public AdminUsersController(UserManager<User> userManager)
    {
        _userManager = userManager;
        _userManager.PasswordValidators.Clear();
        _userManager.UserValidators.Clear();
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetList([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int perPage = 10)
    {
        var parsedFilter = filter is null ? new Dictionary<string, string>() : JsonSerializer.Deserialize<Dictionary<string, string>>(filter);

        var query = parsedFilter?.ContainsKey("userName") ?? false ? _userManager.Users.Where(a => a.NormalizedUserName!.Contains(parsedFilter["userName"].ToUpper())) : _userManager.Users;
        
        var users = await query
            .OrderByDescending(a => a.Id)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .Select(u => new UserResponse
            {
                UserName = u.UserName!,
                Role = u.Role,
                Id = u.Id
            })
            .ToListAsync();

        var totalCount = await _userManager.Users.CountAsync();
        Response.Headers.Append("Content-Range", $"users {(page - 1) * perPage}-{(page - 1) * perPage + users.Count - 1}/{totalCount}");

        return Ok(users);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> Get(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return new UserResponse
        {
            UserName = user.UserName!,
            Role = user.Role,
            Id = id
        };
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<UserResponse>> Put(string id, [FromBody] UserRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound();

        user.UserName = request.UserName;
        user.Role = request.Role;
        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.Password);
        
        try
        {
            var result = await _userManager.UpdateAsync(user);
            
            if (!result.Succeeded)
                return BadRequest();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ExistsAsync(id))
            {
                return NotFound();
            }
            else
            {
                return Conflict();
            }
        }

        return new UserResponse
        {
            UserName = request.UserName,
            Role = request.Role,
            Id = id
        };
    }
    
    [HttpPost]
    public async Task<ActionResult<UserResponse>> Post([FromBody] UserRequest request)
    {
        var user = new User
        {
            UserName = request.UserName,
            Role = request.Role
        };

        try
        {
            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest();
        }
        catch
        {
            return Conflict();
        }

        return new UserResponse
        {
            UserName = request.UserName,
            Role = request.Role,
            Id = user.Id
        };
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        await _userManager.DeleteAsync(user);

        return Ok(new {id});
    }

    private async Task<bool> ExistsAsync(string id)
    {
        return await _userManager.FindByIdAsync(id) is not null;
    }

    public class UserRequest
    {
        public string UserName { get; init; } = null!;
        public string Password { get; init; } = null!;
        public Role Role { get; init; }
    }
    
    public class UserResponse
    {
        public string Id { get; init; } = null!;
        public string UserName { get; init; } = null!;
        public Role Role { get; init; }
    }
}
