using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Backend.Models;
using Backend.DTOs;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Backend.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtworkController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<ArtworkController> _logger;

        public ArtworkController(DatabaseContext context, ILogger<ArtworkController> logger)
        {
            _context = context;
            _logger = logger;
            _logger.LogDebug("ArtworkController initialized.");
        }

[HttpPost("add-artwork")]
[Authorize]
public async Task<IActionResult> AddArtwork([FromBody] ArtworkDto artworkDto)
{
    _logger.LogDebug("Received add artwork request with title: {Title}", artworkDto.Title);

    if (!User.Identity.IsAuthenticated)
    {
        _logger.LogWarning("Unauthorized attempt to add artwork.");
        return Unauthorized("You must be logged in to post artwork.");
    }

    try
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            _logger.LogWarning("No user ID claim present in token.");
            return Unauthorized("Token is invalid or expired.");
        }

        int userId = int.Parse(userIdClaim);
        _logger.LogDebug("Adding artwork for user ID: {UserId}", userId);

        var artwork = new Artwork
        {
            Title = artworkDto.Title,
            Description = artworkDto.Description,
            Artist = artworkDto.Artist,
            ImageUrl = artworkDto.ImageUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UserId = userId
        };

        _context.Artworks.Add(artwork);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Artwork titled '{Title}' added successfully by user ID {UserId}.", artwork.Title, userId);

        return Ok(new { message = "Artwork added successfully!" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error occurred while adding artwork.");
        return StatusCode(500, "Internal server error while adding artwork.");
    }
}

    }
}
