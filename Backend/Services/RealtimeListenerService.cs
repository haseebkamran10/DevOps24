using System.Net.WebSockets;

using System.Text;


namespace Backend.Services
{
    public class RealtimeListenerService : IHostedService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private ClientWebSocket _webSocket;

        public RealtimeListenerService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _webSocket = new ClientWebSocket();
            await ConnectWebSocket(cancellationToken);
        }

        private async Task ConnectWebSocket(CancellationToken cancellationToken)
        {
            try
            {
                var supabaseUrl = _configuration["Supabase:Url"] + "/realtime/v1/websocket?apikey=" + _configuration["Supabase:ApiKey"];
                await _webSocket.ConnectAsync(new Uri(supabaseUrl), cancellationToken);
                Console.WriteLine("WebSocket connection established.");
                await Listen(cancellationToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to connect WebSocket: {ex.Message}");
                
            }
        }

        private async Task Listen(CancellationToken cancellationToken)
        {
            var buffer = new byte[2048];
            while (!_webSocket.CloseStatus.HasValue)
            {
                var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"Message received: {message}");
                
                }
            }
            await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, cancellationToken);
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_webSocket != null && _webSocket.State == WebSocketState.Open)
            {
                await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Service stopping", cancellationToken);
                Console.WriteLine("WebSocket connection closed.");
            }
        }
    }
}
