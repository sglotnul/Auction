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
                    ValidateAudience = false,
                    ValidateIssuer = false,
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

        services.AddControllersWithViews();

        services.AddSpaStaticFiles(configuration =>
        {
            configuration.RootPath = "client_app/build";
        });

        services.AddErrorCodeResolver();
    }
    
    public void Configure(IApplicationBuilder app)
    {
        app.Use(async (c, next) =>
        {
            await Task.Delay(1500);
            await next.Invoke();
        });
        
        app.UseExceptionHandler(new ExceptionHandlerOptions
        {
            ExceptionHandler = context =>
            {
                var errorCode = app.ApplicationServices.GetRequiredService<IErrorCodeResolver>().GetErrorCode(ErrorCodes.InternalServerError);
                context.Response.StatusCode = (int)errorCode.HttpCode;
                return context.Response.WriteAsync(errorCode.ErrorCode);
            }
        });
        
        app.UseWebSockets();
        
        app.UseSpaStaticFiles();

        app.UseRouting();
        
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.UseEndpoints(e => e.MapControllers());
        
        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "client_app";
        });
    }
}