using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Auction.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Auction.Model;

public interface IAuthTokenProvider
{
    public TokenDto GetToken(User user);
}

public class AuthTokenProvider : IAuthTokenProvider
{
    private static TimeSpan TokenLifeTime => TimeSpan.FromHours(12);
    
    private static JwtSecurityTokenHandler _tokenHandler = new();
	
    private readonly UserManager<User> _userManager;
    private readonly AuthOptions _authOptions;

    public AuthTokenProvider(UserManager<User> userManager, IOptions<AuthOptions> authOptions)
    {
        _userManager = userManager;
        _authOptions = authOptions.Value;
    }
    
    public TokenDto GetToken(User user)
    {
        var authClaims = new Claim[]
        {
            new(ClaimTypes.Name, user.UserName!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authOptions.Key));

        var token = new JwtSecurityToken(
            expires: DateTime.Now.Add(TokenLifeTime),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new TokenDto(_tokenHandler.WriteToken(token), token.ValidTo);
    }
}

public record TokenDto(string Token, DateTime ExpirationDateTime);