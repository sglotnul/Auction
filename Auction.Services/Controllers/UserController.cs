using Auction.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

[Route("api")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context;
    private readonly IAuthTokenProvider _tokenProvider;

    public UserController(
        UserManager<User> userManager,
        AppDbContext context,
        IAuthTokenProvider tokenProvider,
        IErrorCodeResolver errorCodeResolver) 
        : base(errorCodeResolver)
    {
        _userManager = userManager;
        _context = context;
        _tokenProvider = tokenProvider;
        
        _userManager.PasswordValidators.Clear();
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest request)
    {
        var profile = request.Profile is null
            ? null
            : new Profile
            {
                FirstName = request.Profile.FirstName?.Trim(),
                LastName = request.Profile.LastName?.Trim(),
                BirthDate = request.Profile.BirthDate?.Date,
                Biography = request.Profile.Biography?.Trim(),
                Education = request.Profile.Education?.Trim()
            };

        var user = new User { UserName = request.UserName.Trim(), Role = request.Role, ProfileId = profile?.Id };
        var result = profile is not null
            ? await CreateUserWithProfileAsync(user, request.Password.Trim(), profile)
            : await CreateUserAsync(user, request.Password.Trim());

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
        var user = await _userManager.FindByNameAsync(request.Username.Trim());

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password.Trim())) 
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
    
    private Task<IdentityResult> CreateUserAsync(User user, string password)
    {
        return _userManager.CreateAsync(user, password);
    }

    private async Task<IdentityResult> CreateUserWithProfileAsync(User user, string password, Profile profile)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            await _context.Profiles.AddAsync(profile);
            await _context.SaveChangesAsync();

            user.ProfileId = profile.Id;
            var result = await CreateUserAsync(user, password);

            if (result.Succeeded)
            {
                await transaction.CommitAsync();
            }
            else
            {
                await transaction.RollbackAsync();
            }
            
            return result;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw; 
        }
    }
}