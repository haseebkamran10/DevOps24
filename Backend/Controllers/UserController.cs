using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(DatabaseContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] RegisterUserDto userDto)
        {
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Username = userDto.Username ?? userDto.Email,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                AddressLine = userDto.AddressLine,
                City = userDto.City,
                Zip = userDto.Zip,
                Country = userDto.Country,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"New user added: {user.Username}");
            return Ok(new { message = "User added successfully.", userId = user.UserId });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogError($"User not found: {id}");
                return NotFound("User not found.");
            }

            _logger.LogInformation($"User fetched: {user.Username}");
            return Ok(user);
        }
[HttpGet("by-phone/{phoneNumber}")]
public async Task<IActionResult> GetUserByPhoneNumber(string phoneNumber)
{
    var user = await _context.Users.SingleOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    if (user == null)
    {
        _logger.LogError($"User not found for phone number: {phoneNumber}");
        return NotFound("User not found.");
    }

    _logger.LogInformation($"User fetched for phone number: {user.PhoneNumber}");
    return Ok(new
    {
        user.FirstName,
        user.LastName,
        user.Username,
        user.Email,
        user.PhoneNumber,
        user.AddressLine,
        user.City,
        user.Zip,
        user.Country
    });
}

}
}