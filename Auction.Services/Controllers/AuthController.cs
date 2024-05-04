using System.Net;

using Auction.Model;

using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

[Route("api")]
public class AuthController : Controller
{
    private readonly IAuthenticationClient _authenticationClient;

    public AuthController(IAuthenticationClient authenticationClient)
    {
        _authenticationClient = authenticationClient;
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
}