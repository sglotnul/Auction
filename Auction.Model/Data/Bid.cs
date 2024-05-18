namespace Auction.Model;

public class Bid
{
	public int Id { get; set; }
	
	public DateTime DateTime { get; set; }
	
	public decimal Amount { get; set; }
	public string Comment { get; set; } = null!;
	
	public int AuctionId { get; set; }
	public Auction Auction { get; set; } = null!;
	
	public string UserId { get; set; } = null!;
	public User User { get; set; } = null!;
}