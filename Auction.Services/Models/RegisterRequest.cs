using Auction.Model;

namespace Auction.Services;

public record RegisterRequest
{
	public string Username { get; set; }
	public string Password { get; set; }
	public Role Role { get; set; }
}