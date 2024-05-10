namespace Auction.Model;

public class AuctionCategory
{
	public int AuctionId { get; set; }
	public int CategoryId { get; set; }
	public Auction Auction { get; set; }
	public Category Category { get; set; }
}