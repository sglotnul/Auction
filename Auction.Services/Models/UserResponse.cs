using Auction.Model;

namespace Auction.Services;

public record UserResponse
{
	public string UserId { get; init; } = null!;
	public string UserName { get; init; } = null!;
	public Role Role { get; init; }
	public Profile? Profile { get; init; }
}