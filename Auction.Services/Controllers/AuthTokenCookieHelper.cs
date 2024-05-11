namespace Auction.Services;

public static class AuthTokenCookieHelper
{
	private const string CookieKey = "access_token";
	
	public static string? TryGet(HttpRequest request)
	{
		return request.Cookies[CookieKey];
	}
	
	public static void Append(HttpResponse response, string value, DateTime expirationDateTime)
	{
		var options = GetCookieOptions();
		options.Expires = expirationDateTime;

		response.Cookies.Append(CookieKey, value, options);
	}
	
	public static void Remove(HttpResponse response)
	{
		response.Cookies.Delete(CookieKey, GetCookieOptions());
	}
	
	private static CookieOptions GetCookieOptions() 
		=> new()
		{
			HttpOnly = true,
			SameSite = SameSiteMode.Strict
		};
}