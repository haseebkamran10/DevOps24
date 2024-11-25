using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Backend.DTOs;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _context;
        private readonly HttpClient _httpClient;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserController(IConfiguration configuration, DatabaseContext context, IPasswordHasher<User> passwordHasher)
        {
            _configuration = configuration;
            _context = context;
            _passwordHasher = passwordHasher;

            var supabaseUrl = _configuration["Supabase:Url"];
            if (string.IsNullOrEmpty(supabaseUrl))
            {
                throw new Exception("Supabase:Url is not configured. Please check appsettings.json or environment variables.");
            }

            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(supabaseUrl)
            };
            _httpClient.DefaultRequestHeaders.Add("apikey", _configuration["Supabase:ApiKey"] ?? throw new Exception("Supabase:ApiKey is not configured."));
        }

        // Register a new user using Supabase
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            var payload = new
            {
                email = registerDto.Email,
                password = registerDto.Password,
                options = new
                {
                    data = new
                    {
                        firstName = registerDto.FirstName,
                        lastName = registerDto.LastName,
                        phoneNumber = registerDto.PhoneNumber,
                        addressLine = registerDto.AddressLine,
                        city = registerDto.City,
                        zip = registerDto.Zip,
                        country = registerDto.Country
                    }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("/auth/v1/signup", content);

            if (response.IsSuccessStatusCode)
            {
                // Save the user data in your database
                var user = new User
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Username = registerDto.Username,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber,
                    AddressLine = registerDto.AddressLine,
                    City = registerDto.City,
                    Zip = registerDto.Zip,
                    Country = registerDto.Country,
                    PasswordHash = _passwordHasher.HashPassword(null, registerDto.Password), // Hash the password
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Registration successful!" });
            }

            var errorResponse = await response.Content.ReadAsStringAsync();
            return BadRequest(new { message = "Registration failed.", details = errorResponse });
        }

        // Login an existing user using Supabase
 [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
{
    // Log incoming headers to check if Authorization is being sent
    foreach (var header in Request.Headers)
    {
        Console.WriteLine($"Header: {header.Key} = {header.Value}");
    }

    var payload = new
    {
        email = loginDto.Email,
        password = loginDto.Password
    };

    var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
    var response = await _httpClient.PostAsync("/auth/v1/token?grant_type=password", content);

    if (response.IsSuccessStatusCode)
    {
        var responseBody = await response.Content.ReadAsStringAsync();
        var responseJson = JsonSerializer.Deserialize<JsonElement>(responseBody);

        // Extract token and user ID from the response
        var accessToken = responseJson.GetProperty("access_token").GetString();
        var userId = responseJson.GetProperty("user").GetProperty("id").GetString(); // Assuming "user" has "id"

        return Ok(new
        {
            accessToken,
            userId,
            message = "Login successful!"
        });
    }

    var errorResponse = await response.Content.ReadAsStringAsync();
    return Unauthorized(new { message = "Login failed.", details = errorResponse });
}


    }
}
