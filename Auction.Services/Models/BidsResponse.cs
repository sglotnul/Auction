namespace Auction.Services;

public record BidsResponse
{
    public IReadOnlyCollection<BidResponse> Bids { get; init; } = null!;
    public decimal? CurrentPrice { get; init; }
}

public record BidResponse
{
    public decimal Amount { get; init; }
    public string? Comment { get; init; }
    public UserResponse User { get; init; } = null!;
    public DateTime DateTime { get; init; }
}