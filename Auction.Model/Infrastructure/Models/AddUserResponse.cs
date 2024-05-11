namespace Auction.Model;

public record AddUserResponse(JwtResponse JwtToken, string UserId);