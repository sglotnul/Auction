using System.Net;
using System.Net.Http.Json;

namespace Auction.Model;

public interface IAuthenticationClient
{
	Task<ServiceResponse<AddUserResponse>> AddUserAsync(string username, string password);

	Task<ServiceResponse<JwtResponse>> GetTokenAsync(string username, string password);
}

public class AuthenticationClient : IAuthenticationClient
{
	private readonly HttpClient _httpClient;

	public AuthenticationClient(
		HttpClient httpClient)
	{
		_httpClient = httpClient;
	}
	
	public async Task<ServiceResponse<AddUserResponse>> AddUserAsync(string username, string password)
	{
		var response = await _httpClient.PostAsync("add", JsonContent.Create(new { username, password }));
		return await GetResponseDtoAsync<AddUserResponse>(response);
	}
	
	public async Task<ServiceResponse<JwtResponse>> GetTokenAsync(string username, string password)
	{
		var response = await _httpClient.PostAsync("get-token", JsonContent.Create(new { username, password }));
		return await GetResponseDtoAsync<JwtResponse>(response);
	}

	private static async Task<ServiceResponse<TResponse>> GetResponseDtoAsync<TResponse>(HttpResponseMessage response)
		where TResponse : class
	{
		var result = (TResponse?)null;
		var errorCode = (string?)null;

		if (response.StatusCode == HttpStatusCode.OK)
		{
			result = await response.Content.ReadFromJsonAsync<TResponse>();
		}
		else
		{
			errorCode = await response.Content.ReadAsStringAsync();
		}
		
		return new ServiceResponse<TResponse>(
			response.StatusCode,
			result,
			errorCode);
	}
}