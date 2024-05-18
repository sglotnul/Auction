namespace Auction.Services;

public record CategoryResponse
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
}