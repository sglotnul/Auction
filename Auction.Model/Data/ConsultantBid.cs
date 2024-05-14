namespace Auction.Model;

public class ConsultantBid
{
	public int Id { get; set; }
	public int AuctionId { get; set; }
	public string ConsultantUserId { get; set; } = null!;
	public Auction Auction { get; set; } = null!;
	public User ConsultantUser { get; set; } = null!;
}