using System.Net;

namespace Auction.Model;

public class ServiceResponse<TResult>
{
	public HttpStatusCode StatusCode { get; }
	public TResult? Result { get; }
	public string? ErrorCode { get; }

	public ServiceResponse(
		HttpStatusCode statusCode,
		TResult? result,
		string? errorCode)
	{
		StatusCode = statusCode;
		Result = result;
		ErrorCode = errorCode;
	}
}