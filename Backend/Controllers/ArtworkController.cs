using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Backend.DTOs;
using System.Security.Claims;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtworkController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly ILogger<ArtworkController> _logger;

        public ArtworkController(IConfiguration configuration, ILogger<ArtworkController> logger)
        {
            _configuration = configuration;
            _logger = logger;

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

        [HttpPost("add-artwork")]
        public async Task<IActionResult> AddArtwork([FromBody] ArtworkDto artworkDto)
        {
            _logger.LogDebug("Received add artwork request with title: {Title}", artworkDto.Title);

          if (User?.Identity == null || !User.Identity.IsAuthenticated)
{
    _logger.LogWarning("User.Identity is null or unauthenticated.");
    return Unauthorized("You must be logged in to post artwork.");
}

var claims = User.Claims.ToDictionary(c => c.Type, c => c.Value);
foreach (var claim in claims)
{
    _logger.LogDebug("Claim: {Key} = {Value}", claim.Key, claim.Value);
}

var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
if (string.IsNullOrEmpty(userIdClaim))
{
    _logger.LogWarning("No user ID claim present in token.");
    return Unauthorized("Token is invalid or expired.");
}

_logger.LogDebug("Authenticated user ID: {UserId}", userIdClaim);


            try
            {
                var payload = new
                {
                    title = artworkDto.Title,
                    description = artworkDto.Description,
                    artist = artworkDto.Artist,
                    imageUrl = artworkDto.ImageUrl,
                    createdAt = DateTime.UtcNow,
                    updatedAt = DateTime.UtcNow,
                    user_id = userIdClaim 
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("/rest/v1/artworks", content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Artwork added successfully: {Title}", artworkDto.Title);
                    return Ok(new { message = "Artwork added successfully!" });
                }

                var errorResponse = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error adding artwork: {Error}", errorResponse);
                return StatusCode((int)response.StatusCode, new { message = "Failed to add artwork.", details = errorResponse });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while adding artwork.");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetArtwork(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/rest/v1/artworks?id=eq.{id}");

                if (response.IsSuccessStatusCode)
                {
                    var artworkJson = await response.Content.ReadAsStringAsync();
                    var artwork = JsonSerializer.Deserialize<JsonElement>(artworkJson);
                    return Ok(artwork);
                }

                var errorResponse = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Failed to retrieve artwork with ID {Id}: {Error}", id, errorResponse);
                return NotFound(new { message = "Artwork not found.", details = errorResponse });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while retrieving artwork with ID {Id}.", id);
                return StatusCode(500, "An internal server error occurred.");
            }
        }
    }
}
