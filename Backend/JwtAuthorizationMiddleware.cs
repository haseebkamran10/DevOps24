public class JwtAuthorizationMiddleware
{
    private readonly RequestDelegate _next;

    public JwtAuthorizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        var path = context.Request.Path;
        if (path.StartsWithSegments("/api/user/login") || path.StartsWithSegments("/api/user/register"))
        {
            await _next(context);
            return;
        }

        if (!context.Request.Headers.ContainsKey("Authorization"))
        {
            Console.WriteLine("No Authorization header found.");
            context.Response.StatusCode = 401; // Unauthorized
            await context.Response.WriteAsync("No Authorization header found.");
            return;
        }

        await _next(context);
    }
}