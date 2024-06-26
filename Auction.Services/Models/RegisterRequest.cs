using Auction.Model;

namespace Auction.Services;

public class RegisterRequest
{
	public string UserName { get; set; } = null!;
	public string Password { get; set; } = null!;
	public Role Role { get; set; }
	public ProfileRequest? Profile { get; set; }
}

public class ProfileRequest
{
	public string? Email { get; set; }
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public DateTime? BirthDate { get; set; }
	public string? Biography { get; set; }
	public string? Education { get; set; }
}