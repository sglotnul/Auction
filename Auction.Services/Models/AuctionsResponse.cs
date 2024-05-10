namespace Auction.Services;

public class AuctionsResponse
{
	public IReadOnlyCollection<Model.Auction> Auctions { get; init; }
	public int Count => Auctions.Count;
}