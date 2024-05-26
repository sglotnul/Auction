using System.Reflection;

using Auction.Model;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Auction.Authentication;

public class ApplicationContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
	public AppDbContext CreateDbContext(string[] args)
	{
		var connectionFromEnv = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
		
		var connectionString = connectionFromEnv ?? ConfigurationHelper.CreateConfiguration().GetConnectionString("DefaultConnection") 
			?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
		
		var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
		optionsBuilder.UseNpgsql(
			connectionString, 
			b => b.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName));

		optionsBuilder.UseLoggerFactory(
			LoggerFactory.Create(b => b.AddSimpleConsole()));

		return new AppDbContext(optionsBuilder.Options);
	}
}
