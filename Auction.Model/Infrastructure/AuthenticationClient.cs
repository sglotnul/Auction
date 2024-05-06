using System.Net;
using System.Net.Http.Json;

namespace Auction.Model;

public interface IAuthenticationClient
{
	Task<ServiceResponse<JwtResponse>> AddUserAsync(string username, string password);

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
	
	public async Task<ServiceResponse<JwtResponse>> AddUserAsync(string username, string password)
	{
		var response = await _httpClient.PostAsync("add", JsonContent.Create(new { username, password }));
		return await GetResponseDtoAsync(response);
	}
	
	public async Task<ServiceResponse<JwtResponse>> LoginAsync(string username, string password)
	{
		var response = await _httpClient.PostAsync("login", JsonContent.Create(new { username, password }));
		return await GetResponseDtoAsync(response);
	}

	private static async Task<ServiceResponse<JwtResponse>> GetResponseDtoAsync(HttpResponseMessage response)
	{
		var result = (JwtResponse?)null;
		var errorMessage = (string?)null;

		if (response.StatusCode == HttpStatusCode.OK)
		{
			result = await response.Content.ReadFromJsonAsync<JwtResponse>();
		}
		else
		{
			errorMessage = await response.Content.ReadAsStringAsync();
		}
		
		return new ServiceResponse<JwtResponse>(
			response.StatusCode,
			result,
			errorMessage);
	}
}