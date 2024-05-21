namespace Auction.Services;

public class AuctionCreateRequest
{
    public string Title { get; init; } = null!;
    public string Description { get; init; } = null!;
    public IReadOnlyCollection<int> Categories { get; init; } = null!;
}