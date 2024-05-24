namespace Auction.Model;

public class Auction
{
	public int Id { get; set; }
	
	public string Title { get; set; } = null!;
	public string Description { get; set; } = null!;
	public decimal MinDecrease { get; set; }
	public decimal InitialPrice { get; set; }

	public DateTime? StartAt { get; set; }
	public DateTime? EndAt { get; set; }
	public AuctionStatus Status { get; set; }
	
	public Consultation? Consultation { get; set; }

	public string UserId { get; set; } = null!;
	public User User { get; set; } = null!;
	
	public ICollection<Category> Categories { get; set; } = new List<Category>();
	public ICollection<Bid> Bids { get; set; } = new List<Bid>();
}