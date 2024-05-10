namespace Auction.Model;

public class User
{
	public string Id { get; set; }
	public Role Role { get; set; }
	public int? ProfileId { get; set; }
	public Profile? Profile { get; set; }
}