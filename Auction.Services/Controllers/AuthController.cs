using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

[Route("api")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IAuthTokenProvider _tokenProvider;

    public AuthController(UserManager<User> userManager, IAuthTokenProvider tokenProvider, IErrorCodeResolver errorCodeResolver) 
        : base(errorCodeResolver)
    {
        _userManager = userManager;
        _tokenProvider = tokenProvider;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest request)
    {
        _userManager.PasswordValidators.Clear();
		
        var user = new User { UserName = request.UserName };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return ErrorCode(result.Errors.FirstOrDefault()?.Code ?? throw new InvalidOperationException());
        }

        var tokenDto = _tokenProvider.GetToken(user);

        AuthTokenCookieHelper.Append(
            Response, 
            tokenDto.Token, 
            tokenDto.ExpirationDateTime);

        return Json(
            new UserResponse
            {
                UserId = user.Id,
                UserName = user.UserName,
                Role = request.Role
            });
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.Username);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password)) 
            return ErrorCode(ErrorCodes.InvalidUserNameOrPassword);

        var tokenDto = _tokenProvider.GetToken(user);

        AuthTokenCookieHelper.Append(
            Response, 
            tokenDto.Token, 
            tokenDto.ExpirationDateTime);

        return Json(
            new UserResponse
            {
                UserId = user.Id,
                UserName = user.UserName!,
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
        var user = await _userManager.GetUserAsync(HttpContext.User);
     
        if (user is null)
            throw new InvalidOperationException("Authorized user not found.");
        
        return Json(
            new UserResponse
            {
                UserId = user.Id,
                UserName = user.UserName!,
                Role = user.Role
            });
    }
}