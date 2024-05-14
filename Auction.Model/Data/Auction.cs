namespace Auction.Model;

public class Auction
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string Description { get; set; } = null!;
	public AuctionStatus Status { get; set; }
	public string StudentUserId { get; set; } = null!;
	public User StudentUser { get; set; } = null!;
}