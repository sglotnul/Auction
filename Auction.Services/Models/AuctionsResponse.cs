namespace Auction.Services;

public class AuctionsResponse
{
	public IReadOnlyCollection<Model.Auction> Auctions { get; init; } = null!;
	public int Count => Auctions.Count;
}