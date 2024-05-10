namespace Auction.Model;

public class Profile
{
	public int Id { get; set; }
	public string FirstName { get; set; }
	public string? LastName { get; set; }
	public Sex? Sex { get; set; }
	public int? Age { get; set; }
	public string? Biography { get; set; }
	public string? Education { get; set; }
}