using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

using Auction.Model;

using Microsoft.AspNetCore.Authentication;
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

        if (response.StatusCode is HttpStatusCode.Unauthorized)
            return Unauthorized();

        if (response.StatusCode != HttpStatusCode.OK)
            throw new InvalidOperationException("Status code is not 200.");
        
        if (response.Result is null)
            throw new InvalidOperationException();

        var result = response.Result;

        AuthTokenCookieHelper.Append(
            Response, 
            result.Token, 
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = result.ExpirationDateTime
            });

        return Ok();
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)
    {
        var response = await _authenticationClient.LoginAsync(request.Username, request.Password);

        if (response.StatusCode is HttpStatusCode.Unauthorized)
            return Unauthorized(response.ErrorMessage);

        if (response.StatusCode != HttpStatusCode.OK)
            throw new InvalidOperationException($"Status code is not 200. Error: {response.ErrorMessage}");
        
        if (response.Result is null)
            throw new InvalidOperationException($"{nameof(response.Result)} cannot be null");

        var result = response.Result;

        AuthTokenCookieHelper.Append(
            Response, 
            result.Token, 
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = result.ExpirationDateTime
            });

        var claims = GetClaimsFromToken(result.Token);
        
        var userId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var userName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

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