namespace Auction.Services;

public static class AuthTokenCookieHelper
{
	private const string CookieKey = "access_token";
	
	public static string? TryGet(HttpRequest request)
	{
		return request.Cookies[CookieKey];
	}
	
	public static void Append(HttpResponse response, string value, CookieOptions cookieOptions)
	{
		response.Cookies.Append(CookieKey, value, cookieOptions);
	}
}