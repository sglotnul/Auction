namespace Auction.Services;

public static class ErrorCodes
{
    public const string InternalServerError = "InternalServerError";
    public const string InvalidUserNameOrPassword = "InvalidUserNameOrPassword";
    public const string NotFound = "NotFound";
    public const string InvalidRole = "InvalidRole";
    public const string Forbidden = "Forbidden";
    public const string InvalidBid = "InvalidBid";
    public const string AuctionAlreadyStarted = "AuctionAlreadyStarted";
    public const string InvalidLaunchPeriod = "InvalidLaunchPeriod";
    public const string InvalidInitialPrice = "InvalidInitialPrice";
}