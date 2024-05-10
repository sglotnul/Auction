using System.Net.WebSockets;
using System.Text;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Services;

public class WSController : Controller
{
    [Route("/ws")]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await Echo(webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
    
    private static async Task Echo(WebSocket webSocket)
    {
        while (true)
        {
            var data = Encoding.UTF8.GetBytes(DateTime.Now.ToString());
            await webSocket.SendAsync(
                new ArraySegment<byte>(data, 0, data.Length),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None);
            
            /*
            var buffer = new byte[1024 * 4];
            await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);

            var s = Encoding.UTF8.GetString(buffer).TrimEnd('\0');
            Console.WriteLine(s);
            Console.WriteLine(s.Length);
            */

            await Task.Delay(TimeSpan.FromSeconds(10));
        }
    }
}