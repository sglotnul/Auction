namespace Auction.Model;

public record TokenResponse
{
	public string Token { get; init; }
	public DateTime ExpirationDateTime { get; init; }
}