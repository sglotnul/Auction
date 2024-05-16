namespace Auction.Services;

public class CreateAuctionRequest
{
    public string Title { get; init; } = null!;
    public string Description { get; init; } = null!;
    public IReadOnlyCollection<int> Categories { get; init; } = null!;
}