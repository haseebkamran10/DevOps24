using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;       // Correct namespace for User model
using Backend.DTOs;         // Correct namespace for DTOs
using Backend.Data;         // Correct namespace for DatabaseContext
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserController(DatabaseContext context, IConfiguration configuration, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
        }

        // Register a new user
       [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
{
    try
    {
        if (string.IsNullOrWhiteSpace(registerDto.Email) || string.IsNullOrWhiteSpace(registerDto.Password))
        {
            return BadRequest(new { message = "Email and Password are required." });
        }

        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            return Conflict(new { message = "User with this email already exists." });
        }

        var user = new User
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Username = $"{registerDto.FirstName}.{registerDto.LastName}".ToLower(),
            Email = registerDto.Email,
            PhoneNumber = registerDto.PhoneNumber,
            AddressLine = registerDto.AddressLine,
            City = registerDto.City,
            Zip = registerDto.Zip,
            Country = registerDto.Country,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, registerDto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Register), new { id = user.UserId }, new { firstName = user.FirstName, message = "Registration successful." });
    }
    catch (Exception ex)
    {
        // Log the exception for debugging
        Console.WriteLine($"Error occurred during registration: {ex.Message}");
        return StatusCode(500, new { message = "An unexpected error occurred on the server." });
    }
}

        // Login an existing user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest(new { message = "Email and Password are required." });
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        // Generate a JWT token for authenticated users
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // Ensure correct property
                new Claim(ClaimTypes.Name, user.Username)
            };

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("JWT key is not configured.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
