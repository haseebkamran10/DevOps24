using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Ensure this is included
using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtworkController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ArtworkController(DatabaseContext context)
        {
            _context = context;
        }

        // Endpoint to create a new artwork
        [HttpPost("create")]
        public async Task<IActionResult> CreateArtworkAsync([FromBody] CreateArtworkDto artworkDto)
        {
            if (string.IsNullOrEmpty(artworkDto.PhoneNumber))
            {
                return BadRequest("The phone number is required.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validate the user based on their phone number
                var user = await _context.Users.SingleOrDefaultAsync(u => u.PhoneNumber == artworkDto.PhoneNumber);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Check if the user has an active session
                var activeSession = await _context.Sessions
                    .FirstOrDefaultAsync(s => s.UserId == user.UserId && s.ExpiresAt > DateTime.UtcNow);
                if (activeSession == null)
                {
                    return Unauthorized("No active session found. Please start a session first.");
                }

                // Create the artwork
                var artwork = new Artwork
                {
                    Title = artworkDto.Title,
                    Description = artworkDto.Description,
                    Artist = artworkDto.Artist,
                    ImageUrl = artworkDto.ImageUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    UserId = user.UserId
                };

                await _context.Artworks.AddAsync(artwork);

                // Save changes
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { artworkId = artwork.ArtworkId, message = "Artwork created successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
