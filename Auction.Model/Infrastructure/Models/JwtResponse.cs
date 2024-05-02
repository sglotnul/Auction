namespace Auction.Model;

public record JwtResponse
{
	public string Token { get; init; }
	public DateTime ExpirationDateTime { get; init; }
}