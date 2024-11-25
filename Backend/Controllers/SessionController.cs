using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
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

        // Starts a new session and links it to a user based on the phone number
       [HttpPost("start")]
public IActionResult StartSession([FromBody] StartSessionDto sessionDto)
{
    if (string.IsNullOrEmpty(sessionDto.PhoneNumber))
    {
        return BadRequest("The phone number is required.");
    }

    var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == sessionDto.PhoneNumber);
    if (user == null)
    {
        return NotFound("User not found.");
    }

    var session = new Session
    {
        SessionId = Guid.NewGuid(),
        CreatedAt = DateTime.UtcNow,
        ExpiresAt = DateTime.UtcNow.AddHours(1),
        UserId = user.UserId
    };

    _context.Sessions.Add(session);
    user.LastSessionId = session.SessionId; // Update the user's last session ID
    _context.SaveChanges();

    return Ok(new { sessionId = session.SessionId });
}

        // Ends an existing session and removes it from the database
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
