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
            resolver.Map(ErrorCodes.InvalidBid, HttpStatusCode.Forbidden);
            resolver.Map(ErrorCodes.AuctionAlreadyStarted, HttpStatusCode.Conflict);
            resolver.Map(ErrorCodes.InvalidAuctionState, HttpStatusCode.Conflict);
            resolver.Map(ErrorCodes.InvalidLaunchPeriod, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.InvalidInitialPrice, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.CategoriesEmpty, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.TitleTooLong, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.DescriptionTooLong, HttpStatusCode.BadRequest); 
            resolver.Map(ErrorCodes.BidCommentTooLong, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.FirstNameTooLong, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.LastNameTooLong, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.EducationTooLong, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.BiographyTooLong, HttpStatusCode.BadRequest);
            resolver.Map(ErrorCodes.InvalidEmail, HttpStatusCode.BadRequest);
            
            resolver.Map(DuplicateUserNameCode, HttpStatusCode.BadRequest);
            resolver.Map(PasswordTooShort, HttpStatusCode.BadRequest);
            resolver.Map(PasswordRequiresNonAlphanumeric, HttpStatusCode.BadRequest);
            resolver.Map(PasswordRequiresUpper, HttpStatusCode.BadRequest);

            return resolver;
        });

        return services;
    }

    private static string DuplicateUserNameCode => _identityErrorDescriber.DuplicateUserName(string.Empty).Code;
    private static string PasswordTooShort => _identityErrorDescriber.PasswordTooShort(6).Code;
    private static string PasswordRequiresNonAlphanumeric => _identityErrorDescriber.PasswordRequiresNonAlphanumeric().Code;
    private static string PasswordRequiresUpper => _identityErrorDescriber.PasswordRequiresUpper().Code;
}