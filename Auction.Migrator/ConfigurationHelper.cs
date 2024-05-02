using Microsoft.Extensions.Configuration;

namespace Auction.Authentication;

public static class ConfigurationHelper
{
	private const string ConfigurationFilePath = "appsettings.json";
	
	public static IConfiguration CreateConfiguration()
	{
		return new ConfigurationBuilder()
			.AddJsonFile(ConfigurationFilePath)
			.Build();
	}
}