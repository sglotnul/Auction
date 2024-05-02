using System.Net.Http.Json;
using System.Runtime.Serialization;
using System.Text.Json;

using Microsoft.Extensions.Options;

namespace Auction.Model;

public interface IAuthenticationClient
{
	Task<ServiceResponse<JwtResponse>> LoginAsync(string username, string password);
}

public class AuthenticationClient : IAuthenticationClient
{
	private readonly HttpClient _httpClient;

	public AuthenticationClient(
		HttpClient httpClient)
	{
		_httpClient = httpClient;
	}
	
	public async Task<ServiceResponse<JwtResponse>> LoginAsync(string username, string password)
	{
		var response = await _httpClient.PostAsync("login", JsonContent.Create(new { username, password }));
		return new ServiceResponse<JwtResponse>(
			response.StatusCode,
			await response.Content.ReadFromJsonAsync<JwtResponse>());
	}
}