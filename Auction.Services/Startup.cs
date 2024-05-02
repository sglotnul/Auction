using System.Text;

using Auction.Authentication;
using Auction.Model;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Auction.Services;

public class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public void ConfigureServices(IServiceCollection services)
    {
        var authenticationSection = _configuration.GetRequiredSection("Authentication");

        services.AddModel(_configuration);

        services
            .AddAuthorization()
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSection.Get<AuthOptions>()!.Key))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = AuthTokenCookieHelper.TryGet(context.Request);
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddControllers();
    }
    
    public void Configure(IApplicationBuilder app)
    {
        app.UseWebSockets();

        app.UseRouting();
        
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.UseEndpoints(e => e.MapControllers());
        
        app.UseStaticFiles();
    }
}