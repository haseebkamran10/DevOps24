using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

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

        // Create a new artwork with file upload
        [HttpPost("create")]
        public async Task<IActionResult> CreateArtworkAsync([FromForm] CreateArtworkDto artworkDto)
        {
            if (string.IsNullOrEmpty(artworkDto.PhoneNumber))
            {
                return BadRequest("The phone number is required.");
            }

            if (artworkDto.ImageFile == null || artworkDto.ImageFile.Length == 0)
            {
                return BadRequest("An image file is required.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validate user by phone number
                var user = await _context.Users.SingleOrDefaultAsync(u => u.PhoneNumber == artworkDto.PhoneNumber);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Check if user has an active session
                var activeSession = await _context.Sessions
                    .FirstOrDefaultAsync(s => s.UserId == user.UserId && s.ExpiresAt > DateTime.UtcNow);
                if (activeSession == null)
                {
                    return Unauthorized("No active session found. Please start a session first.");
                }

                // Upload the file to the Azure VM
                string imageUrl;
                using (var httpClient = new HttpClient())
                {
                    // Generate a unique filename
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(artworkDto.ImageFile.FileName)}";
                    var uploadUrl = $"http://51.120.6.249:9000/upload/{fileName}";

                    using (var fileStream = artworkDto.ImageFile.OpenReadStream())
                    {
                        var content = new StreamContent(fileStream);
                        content.Headers.ContentType = new MediaTypeHeaderValue(artworkDto.ImageFile.ContentType);

                        var response = await httpClient.PutAsync(uploadUrl, content);

                        if (!response.IsSuccessStatusCode)
                        {
                            return StatusCode((int)response.StatusCode, "Failed to upload image to Azure VM.");
                        }
                    }

                    // Construct the image URL
imageUrl = $"http://51.120.6.249:9000/upload/{fileName}";
                }

                // Create the artwork
                var artwork = new Artwork
                {
                    Title = artworkDto.Title,
                    Description = artworkDto.Description,
                    Artist = artworkDto.Artist,
                    ImageUrl = imageUrl, // Use the generated image URL
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    UserId = user.UserId
                };

                await _context.Artworks.AddAsync(artwork);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { artworkId = artwork.ArtworkId, message = "Artwork created successfully.", imageUrl });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    
      // Endpoint to fetch all artworks
       [HttpGet]
public async Task<IActionResult> GetAllArtworksAsync()
{
    try
    {
        if (_context.Artworks == null)
        {
            return StatusCode(500, "Artworks data source is not available.");
        }

        var artworks = await _context.Artworks
            .Include(a => a.User) // Include user details if necessary
            .ToListAsync();

        // Return an empty list instead of 404 if no artworks are found
        if (!artworks.Any())
        {
            return Ok(new List<object>());
        }

        // Map artworks to DTOs for frontend compatibility
        var artworkDtos = artworks.Select(a => new 
        {
            a.ArtworkId,
            a.Title,
            a.Description,
            a.Artist,
            a.ImageUrl,
            CreatedAt = a.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"), // Optional formatting
            User = a.User == null ? null : new { a.User.UserId, a.User.FirstName, a.User.LastName }
        }).ToList();

        return Ok(artworkDtos);
    }
    catch (Exception ex)
    {
        // Return a generic error message for better security
        return StatusCode(500, "An unexpected error occurred while fetching artworks.");
    }
}

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtworkByIdAsync(int id)
        {
            try
            {
                var artwork = await _context.Artworks
                    .Include(a => a.User) // Optional: Include user details if needed
                    .FirstOrDefaultAsync(a => a.ArtworkId == id);

                if (artwork == null)
                {
                    return NotFound("Artwork not found.");
                }

                return Ok(artwork);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }

    
}