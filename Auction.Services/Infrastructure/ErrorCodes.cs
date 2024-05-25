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
    public const string InvalidAuctionState = "InvalidAuctionState";
    public const string InvalidLaunchPeriod = "InvalidLaunchPeriod";
    public const string InvalidInitialPrice = "InvalidInitialPrice";
    public const string CategoriesEmpty = "CategoriesEmpty";
    public const string TitleTooLong = "TitleTooLong";
    public const string DescriptionTooLong = "DescriptionTooLong";
    public const string BidCommentTooLong = "BidCommentTooLong";
    public const string FirstNameTooLong = "FirstNameTooLong";
    public const string LastNameTooLong = "LastNameTooLong";
    public const string EducationTooLong = "EducationTooLong";
    public const string BiographyTooLong = "BiographyTooLong";
}