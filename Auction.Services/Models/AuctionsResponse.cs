using Auction.Model;

namespace Auction.Services;

public class AuctionsResponse
{
	public IReadOnlyCollection<AuctionResponse> Auctions { get; init; } = null!;
	public int Count => Auctions.Count;
}

public record AuctionResponse(
	int Id,
	string Title,
	string Description,
	AuctionStatus Status,
	UserResponse User,
	IReadOnlyCollection<Category> Categories);