namespace Auction.Model;

public class ConsultantBid
{
	public int Id { get; set; }
	public int AuctionId { get; set; }
	public string ConsultantUserId { get; set; }
	public Auction Auction { get; set; }
	public User ConsultantUser { get; set; }
}