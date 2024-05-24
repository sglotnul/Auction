namespace Auction.Model;

public class Profile
{
	public int Id { get; set; }
	
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public DateTime? BirthDate { get; set; }
	public string? Biography { get; set; }
	public string? Education { get; set; }
	
	public string UserId { get; set; }
	public User User { get; set; } = null!;
}