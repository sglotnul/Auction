using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

public record AuctionsRequest
{
	[FromQuery(Name = "userName")]
	public string? UserName { get; init; }

	[FromQuery(Name = "category")]
	public IReadOnlyCollection<int>? Categories { get; init; }
}