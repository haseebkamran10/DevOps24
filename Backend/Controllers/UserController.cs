using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;
using Backend.DTOs;
using Backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ILogger<UserController> _logger;

        public UserController(DatabaseContext context, IConfiguration configuration, IPasswordHasher<User> passwordHasher, ILogger<UserController> logger)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        // Register a new user
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

                user.PasswordHash = _passwordHasher.HashPassword(user, registerDto.Password);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("User {Email} registered successfully.", registerDto.Email);
                return Ok("User registered successfully.");
            }
            catch (DbUpdateException ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error executing database update for email {Email}: {ErrorMessage}", registerDto.Email, ex.InnerException?.Message);
                return StatusCode(500, "Database update failed.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Transaction rolled back due to an error for email {Email}.", registerDto.Email);
                return StatusCode(500, "Error registering the user.");
            }
        }


        // Login an existing user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid credentials.");
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
