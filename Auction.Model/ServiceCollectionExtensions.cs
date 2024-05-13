using Auction.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Auction.Model;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddModel(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") ??
           throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.ConfigureServices(configuration);
        services.ConfigureIdentityServices();

        services.ConfigureOptions(configuration);

        return services;
    }

    private static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAuthTokenProvider, AuthTokenProvider>();
        
        return services;
    }
    
    private static IServiceCollection ConfigureIdentityServices(this IServiceCollection services)
    {
        services
            .AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        return services;
    }

    private static IServiceCollection ConfigureOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AuthOptions>(configuration.GetRequiredSection("Authentication"));
        services.Configure<DiscoveryOptions>(configuration.GetRequiredSection("Discovery"));
        
        return services;
    }
}