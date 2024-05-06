using System.Net;

namespace Auction.Model;

public class ServiceResponse<TResult>
{
	public HttpStatusCode StatusCode { get; }
	public TResult? Result { get; }
	public string? ErrorMessage { get; }

	public ServiceResponse(
		HttpStatusCode statusCode,
		TResult? result,
		string? errorMessage)
	{
		StatusCode = statusCode;
		Result = result;
		ErrorMessage = errorMessage;
	}
}