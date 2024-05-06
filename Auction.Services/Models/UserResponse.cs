namespace Auction.Model;

public record UserResponse
{
	public string UserId { get; init; }
	public string UserName { get; init; }
	public Role Role { get; init; }
}