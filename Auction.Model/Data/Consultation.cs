namespace Auction.Model;

public class Consultation
{
	public int Id { get; set; }
	
	public DateTime StartAt { get; set; }
	public ConsultationStatus Status { get; set; }

	public string ConsultantId { get; set; } = null!;
	public User Consultant { get; set; } = null!;
	
	public string StudentId { get; set; } = null!;
	public User Student { get; set; } = null!;
	
	public int AuctionId { get; set; }
	public Auction Auction { get; set; } = null!;
}