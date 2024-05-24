using Microsoft.AspNetCore.Identity;

namespace Auction.Model;

public class User : IdentityUser
{
	public Role Role { get; set; }
	
	public int? ProfileId { get; set; }
	public Profile? Profile { get; set; }
}