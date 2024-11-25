using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;
using Backend.DTOs;
using Backend.Data;
using Supabase;
using Supabase.Gotrue;
using Microsoft.EntityFrameworkCore;

// Resolve ambiguous references by using aliases
using SupabaseClient = Supabase.Client;
using SupabaseUser = Supabase.Gotrue.User;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserController> _logger;
        private readonly SupabaseClient _supabaseClient;

        public UserController(DatabaseContext context, IConfiguration configuration, ILogger<UserController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            // Initialize the Supabase client
            _supabaseClient = new SupabaseClient(_configuration["Supabase:Url"], _configuration["Supabase:ApiKey"]);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                {
                    _logger.LogWarning("Registration failed: User with email {Email} already exists.", registerDto.Email);
                    return BadRequest("User with this email already exists.");
                }

                var signUpResponse = await _supabaseClient.Auth.SignUpWithEmail(registerDto.Email, registerDto.Password);
                if (signUpResponse.Error != null)
                {
                    _logger.LogError("Supabase registration failed: {Error}", signUpResponse.Error.Message);
                    return BadRequest("Failed to register user with Supabase.");
                }

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
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("User {Email} registered successfully.", registerDto.Email);
                return Ok("User registered successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Transaction rolled back due to an error: {Error}", ex.Message);
                return StatusCode(500, "Error registering the user.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            var signInResponse = await _supabaseClient.Auth.SignInWithEmail(loginDto.Email, loginDto.Password);
            if (signInResponse.Error == null)
            {
                var token = GenerateJwtToken(signInResponse.User);
                return Ok(new { Token = token, User = signInResponse.User });
            }
            else
            {
                _logger.LogWarning("Login failed for email {Email}: {Error}", loginDto.Email, signInResponse.Error.Message);
                return Unauthorized(signInResponse.Error.Message);
            }
        }

        private string GenerateJwtToken(SupabaseUser user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Email)
            };

            var jwtKey = _configuration["Jwt:Key"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
