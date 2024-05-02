using System.Net;
using System.Net.Http.Json;
using System.Runtime.Serialization;
using System.Text.Json;

using Microsoft.Extensions.Options;

namespace Auction.Model;

public interface IAuthenticationClient
{
	Task<ServiceResponse<JwtViewModel>> LoginAsync(string username, string password);
}

public class AuthenticationClient : IAuthenticationClient
{
	private readonly HttpClient _httpClient;
	private readonly DiscoveryOptions _discoveryOptions;

	public AuthenticationClient(
		HttpClient httpClient,
		IOptions<DiscoveryOptions> discoveryOptions)
	{
		_httpClient = httpClient;
		_discoveryOptions = discoveryOptions.Value;
	}
	
	public async Task<ServiceResponse<JwtViewModel>> LoginAsync(string username, string password)
	{
		var response = await _httpClient.PostAsync("login", JsonContent.Create(new { username, password }));
		return new ServiceResponse<JwtViewModel>(
			response.StatusCode,
			await response.Content.ReadFromJsonAsync<JwtViewModel>());
	}
}

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

public record JwtViewModel
{
	public string Token { get; init; }
	public DateTime ExpirationDateTime { get; init; }
}