namespace Auction.Model;

public class ConsultationSession
{
	public int Id { get; set; }
	public int AuctionId { get; set; }
	public string ConsultantUserId { get; set; } = null!;
	public string StudentUserId { get; set; } = null!;
	public Auction Auction { get; set; } = null!;
	public User ConsultantUser { get; set; } = null!;
	public User StudentUser { get; set; } = null!;
}