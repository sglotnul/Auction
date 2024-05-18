using Auction.Model;

namespace Auction.Services;

public class AuctionsResponse
{
	public IReadOnlyCollection<AuctionResponse> Auctions { get; init; } = null!;
	public int Count => Auctions.Count;
}

public record AuctionResponse
{
	public int Id { get; init; }
	public string Title { get; init; } = null!;
	public string Description { get; init; } = null!;
	public AuctionStatus Status { get; init; }
	public UserResponse User { get; init; } = null!;
	public IEnumerable<CategoryResponse> Categories { get; init; } = null!;
}