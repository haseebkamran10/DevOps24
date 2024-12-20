using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public SessionController(DatabaseContext context)
        {
            _context = context;
        }

    
        [HttpPost("start")]
        public async Task<IActionResult> StartSessionAsync([FromBody] StartSessionDto sessionDto)
        {
            if (string.IsNullOrEmpty(sessionDto.PhoneNumber))
            {
                return BadRequest("The phone number is required.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = await _context.Users.SingleOrDefaultAsync(u => u.PhoneNumber == sessionDto.PhoneNumber);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var activeSession = _context.Sessions
                    .FirstOrDefault(s => s.UserId == user.UserId && s.ExpiresAt > DateTime.UtcNow);
                if (activeSession != null)
                {
                    return Ok(new { sessionId = activeSession.SessionId });
                }

                var session = new Session
                {
                    SessionId = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddHours(1),
                    UserId = user.UserId
                };

                await _context.Sessions.AddAsync(session);
                user.LastSessionId = session.SessionId;

               
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { sessionId = session.SessionId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("end")]
        public IActionResult EndSession(Guid sessionId)
        {
            var session = _context.Sessions.FirstOrDefault(s => s.SessionId == sessionId);
            if (session != null)
            {
                _context.Sessions.Remove(session);
                _context.SaveChanges();
                return Ok("Session ended successfully.");
            }

            return NotFound("Session not found.");
        }
    }
}
