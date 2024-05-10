namespace Auction.Services;

public record RegisterRequest
{
	public string Username { get; set; }
	public string Password { get; set; }
}