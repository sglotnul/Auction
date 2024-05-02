namespace Auction.Model;

public class ConsultationSession
{
	public int Id { get; set; }
	public int AuctionID { get; set; }
	public int ConsultantUserID { get; set; }
	public int StudentUserID { get; set; }
	public Auction Auction { get; set; }
	public User ConsultantUser { get; set; }
	public User StudentUser { get; set; }
}