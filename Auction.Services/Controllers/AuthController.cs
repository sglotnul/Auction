using System.Net;

using Auction.Model;

using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

public class AuthController : Controller
{
    private readonly IAuthenticationClient _authenticationClient;

    public AuthController(IAuthenticationClient authenticationClient)
    {
        _authenticationClient = authenticationClient;
    }
    
    [HttpPost("/login")]
    public async Task<IActionResult> Get([FromBody] LoginViewModel viewModel)
    {
        var response = await _authenticationClient.LoginAsync(viewModel.Username, viewModel.Password);
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

public class LoginViewModel
{
    public string Username { get; set; }
    public string Password { get; set; }
}