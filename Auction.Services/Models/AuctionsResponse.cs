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
	public decimal MinDecrease { get; init; }
	public decimal InitialPrice { get; init; }
	public AuctionStatus Status { get; init; }
	public DateTime? StartAt { get; init; }
	public DateTime? EndAt { get; init; }
	public UserResponse User { get; init; } = null!;
	public IEnumerable<CategoryResponse> Categories { get; init; } = null!;
}