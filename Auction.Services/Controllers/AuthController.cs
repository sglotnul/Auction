using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.Services;

[Route("api")]
public class AuthController : Controller
{
    private readonly IAuthenticationClient _authenticationClient;
    private readonly AppDbContext _dbContext;

    public AuthController(IAuthenticationClient authenticationClient, AppDbContext dbContext)
    {
        _authenticationClient = authenticationClient;
        _dbContext = dbContext;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest request)
    {
        var response = await _authenticationClient.AddUserAsync(request.Username, request.Password);
        if (response.StatusCode is not HttpStatusCode.OK)
            return StatusCode((int)response.StatusCode, response.ErrorCode);
        
        if (response.Result?.JwtToken is null || response.Result?.UserId is null)
            throw new InvalidOperationException();

        var user = new User
        {
            Id = response.Result.UserId,
            Role = request.Role
        };

        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        AuthTokenCookieHelper.Append(
            Response, 
            response.Result.JwtToken.Token, 
            response.Result.JwtToken.ExpirationDateTime);

        var claims = GetClaimsFromToken(response.Result.JwtToken.Token);

        var userName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        if (userName is null)
            throw new InvalidOperationException("Authorized user name is null.");

        return Json(
            new UserResponse
            {
                UserId = response.Result.UserId,
                UserName = userName,
                Role = request.Role
            });
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)
    {
        var response = await _authenticationClient.GetTokenAsync(request.Username, request.Password);
        if (response.StatusCode is not HttpStatusCode.OK)
            return StatusCode((int)response.StatusCode, response.ErrorCode);
        
        if (response.Result is null)
            throw new InvalidOperationException();

        AuthTokenCookieHelper.Append(
            Response, 
            response.Result.Token, 
            response.Result.ExpirationDateTime);

        var claims = GetClaimsFromToken(response.Result.Token);

        var userId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var userName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        if (userName is null)
            throw new InvalidOperationException("Authorized user name is null.");
        
        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            throw new InvalidDataException($"User with Id={userId} not found.");

        return Json(
             new UserResponse
             {
                 UserId = user.Id,
                 UserName = userName,
                 Role = user.Role
             });
    }
    
    [HttpPost("logout")]
    [Authorize]
    public IActionResult LogoutAsync()
    {
        AuthTokenCookieHelper.Remove(Response);
        return Ok();
    }
    	
    [HttpGet("user")]
    [Authorize]
    public async Task<IActionResult> GetUserAsync()
    {
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = HttpContext.User.Identity?.Name;

        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            throw new InvalidDataException($"User with Id={userId} not found.");
        
        if (userName is null)
            throw new InvalidOperationException("Authorized user name is null.");
        
        return Json(
            new UserResponse
            {
                UserId = userId!,
                UserName = userName,
                Role = user.Role
            });
    }

    private static IReadOnlyCollection<Claim> GetClaimsFromToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        if (tokenHandler.ReadToken(token) is not JwtSecurityToken jwtToken)
            throw new InvalidOperationException();

        return jwtToken.Claims.ToArray();
    }
}