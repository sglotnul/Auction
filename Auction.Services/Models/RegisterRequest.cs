using Auction.Model;

namespace Auction.Services;

public record RegisterRequest
{
	public string UserName { get; set; } = null!;
	public string Password { get; set; } = null!;
	public Role Role { get; set; }
}