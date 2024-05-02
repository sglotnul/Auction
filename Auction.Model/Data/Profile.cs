namespace Auction.Model;

public class Profile
{
	public int Id { get; set; }
	public int UserID { get; set; }
	public Role Role { get; set; }
	public User User { get; set; }
}