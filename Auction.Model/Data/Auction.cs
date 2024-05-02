namespace Auction.Model;

public class Auction
{
	public int Id { get; set; }
	public int StudentUserID { get; set; }
	public User StudentUser { get; set; }
}