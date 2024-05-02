namespace Auction.Model;

public class ConsultationSession
{
	public int Id { get; set; }
	public int AuctionId { get; set; }
	public string ConsultantUserId { get; set; }
	public string StudentUserId { get; set; }
	public Auction Auction { get; set; }
	public User ConsultantUser { get; set; }
	public User StudentUser { get; set; }
}