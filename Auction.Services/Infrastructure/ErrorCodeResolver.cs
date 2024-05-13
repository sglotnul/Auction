using System.Net;

namespace Auction.Services;

public interface IErrorCodeResolver
{
    IErrorCodeDto GetErrorCode(string errorCode);
}

public class ErrorCodeResolver : IErrorCodeResolver
{
    private readonly Dictionary<string, HttpStatusCode> _errorCodeMapping = new();
    
    public IErrorCodeDto GetErrorCode(string errorCode)
    {
        if (!_errorCodeMapping.TryGetValue(errorCode, out var httpStatusCode))
            return new ErrorCodeDto(ErrorCodes.InternalServerError, HttpStatusCode.InternalServerError);

        return new ErrorCodeDto(errorCode, httpStatusCode);
    }

    public void Map(string errorCode, HttpStatusCode httpStatusCode)
    {
        _errorCodeMapping.Add(errorCode, httpStatusCode);
    }

    private readonly struct ErrorCodeDto : IErrorCodeDto
    {
        public string ErrorCode { get; }
        public HttpStatusCode HttpCode { get; }
    
        public ErrorCodeDto(string errorCode, HttpStatusCode code)
        {
            ErrorCode = errorCode;
            HttpCode = code;
        }
    }
}

public interface IErrorCodeDto
{
    string ErrorCode { get; }
    HttpStatusCode HttpCode { get; }
}

