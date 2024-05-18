using System.Net;
using Microsoft.AspNetCore.Identity;

namespace Auction.Services;

public static class ServiceCollectionExtensions
{
    private static readonly IdentityErrorDescriber _identityErrorDescriber = new();
    
    public static IServiceCollection AddErrorCodeResolver(this IServiceCollection services)
    {
        services.AddSingleton<IErrorCodeResolver, ErrorCodeResolver>(_ =>
        {
            var resolver = new ErrorCodeResolver();
            
            resolver.Map(ErrorCodes.InternalServerError, HttpStatusCode.InternalServerError);
            resolver.Map(ErrorCodes.InvalidUserNameOrPassword, HttpStatusCode.Unauthorized);
            resolver.Map(ErrorCodes.NotFound, HttpStatusCode.NotFound);
            resolver.Map(ErrorCodes.InvalidRole, HttpStatusCode.Forbidden);
            resolver.Map(ErrorCodes.Forbidden, HttpStatusCode.Forbidden);
            
            resolver.Map(DuplicateUserNameCode, HttpStatusCode.BadRequest);

            return resolver;
        });

        return services;
    }

    private static string DuplicateUserNameCode => _identityErrorDescriber.DuplicateUserName(string.Empty).Code;
}