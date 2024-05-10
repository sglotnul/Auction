namespace Auction.Model;

public class Auction
{
	public int Id { get; set; }
	public string Name { get; set; }
	public string Description { get; set; }
	public AuctionStatus Status { get; set; }
	public string StudentUserId { get; set; }
	public User StudentUser { get; set; }
}