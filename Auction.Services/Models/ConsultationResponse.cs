using Auction.Model;

namespace Auction.Services;

public class ConsultationsResponse
{
	public IReadOnlyCollection<ConsultationResponse> Consultations { get; init; } = null!;
}

public record ConsultationResponse
{
	public int Id { get; init; }
	
	public DateTime StartAt { get; init; }

	public ConsultationStatus Status { get; init; }

	public UserResponse Consultant { get; init; } = null!;
	
	public UserResponse Student { get; init; } = null!;
	
	public AuctionResponse Auction { get; init; } = null!;
	
	public BidResponse Bid { get; init; } = null!;
}