namespace Auction.Services;

public record ProfileResponse
{
    public int Id { get; init; }
    public string? Email { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public DateTime? BirthDate { get; init; }
    public string? Biography { get; init; }
    public string? Education { get; init; }
}