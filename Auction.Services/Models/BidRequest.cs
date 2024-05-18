namespace Auction.Services;

public class BidRequest
{
    public decimal Amount { get; init; }
    public string Comment { get; init; } = null!;
}