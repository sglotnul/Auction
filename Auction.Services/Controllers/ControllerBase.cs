using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

public abstract class ControllerBase : Controller
{
    private readonly IErrorCodeResolver _errorCodeResolver;

    protected ControllerBase(IErrorCodeResolver errorCodeResolver)
    {
        _errorCodeResolver = errorCodeResolver;
    }
    
    protected IActionResult ErrorCode(string errorCode)
    {
        var errorCodeDto = _errorCodeResolver.GetErrorCode(errorCode);
        return StatusCode((int)errorCodeDto.HttpCode, errorCodeDto.ErrorCode);
    }
}