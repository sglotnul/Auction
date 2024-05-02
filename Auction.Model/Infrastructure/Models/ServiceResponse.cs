using System.Net;

namespace Auction.Model;

public class ServiceResponse<TResult>
{
	public TResult? Result { get; }
	public HttpStatusCode StatusCode { get; }

	public ServiceResponse(
		HttpStatusCode statusCode,
		TResult? result)
	{
		StatusCode = statusCode;
		Result = result;
	}
}