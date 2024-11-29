using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; // Add this using statement
using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<AuctionController> _logger; // Declare the logger

        public AuctionController(DatabaseContext context, ILogger<AuctionController> logger) // Inject the logger
        {
            _context = context;
            _logger = logger;
        }

        // Endpoint to start an auction
        [HttpPost("start")]
        public async Task<IActionResult> StartAuctionAsync([FromBody] AuctionDto auctionDto)
        {
            if (string.IsNullOrEmpty(auctionDto.PhoneNumber))
            {
                return BadRequest("The phone number is required.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validate user by phone number
                var user = await _context.Users.SingleOrDefaultAsync(u => u.PhoneNumber == auctionDto.PhoneNumber);
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

                // Validate ownership of the artwork
                var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.ArtworkId == auctionDto.ArtworkId && a.UserId == user.UserId);
                if (artwork == null)
                {
                    return NotFound("Artwork not found or you do not have permission to auction this artwork.");
                }

                // Check if the artwork is already auctioned
                var existingAuction = await _context.Auctions.FirstOrDefaultAsync(a => a.ArtworkId == auctionDto.ArtworkId && !a.IsClosed);
                if (existingAuction != null)
                {
                    return BadRequest("An active auction already exists for this artwork.");
                }

                // Create the auction
                var auction = new Auction
                {
                    ArtworkId = auctionDto.ArtworkId,
                    StartingBid = auctionDto.StartingBid,
                    MinimumPrice = auctionDto.SecretThreshold,
                    StartTime = DateTime.UtcNow,
                    EndTime = DateTime.UtcNow.AddHours(auctionDto.DurationHours),
                    IsClosed = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Auctions.AddAsync(auction);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { auctionId = auction.AuctionId, message = "Auction started successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // Endpoint to get active auctions
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveAuctionsAsync()
        {
            var activeAuctions = await _context.Auctions
                .Where(a => !a.IsClosed && a.StartTime <= DateTime.UtcNow && a.EndTime > DateTime.UtcNow)
                .Include(a => a.Artwork)
                .ToListAsync();

            return Ok(activeAuctions);
        }

        // Endpoint to end an auction
[HttpPost("end")]
public async Task<IActionResult> EndAuctionAsync([FromBody] EndAuctionDto endAuctionDto)
{
    if (endAuctionDto.AuctionId <= 0)
    {
        return BadRequest("Invalid auction ID.");
    }

    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
        // Fetch the auction
        var auction = await _context.Auctions
            .FirstOrDefaultAsync(a => a.AuctionId == endAuctionDto.AuctionId);

        if (auction == null)
        {
            return NotFound("Auction not found.");
        }

        // Delete the auction
        _context.Auctions.Remove(auction);

        // Save changes and commit the transaction
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        _logger.LogInformation($"Auction {auction.AuctionId} has been successfully removed.");
        return Ok(new { message = $"Auction {auction.AuctionId} has been removed successfully." });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        _logger.LogError($"Error removing auction {endAuctionDto.AuctionId}: {ex.Message}");
        return StatusCode(500, $"An error occurred: {ex.Message}");
    }
}


    }
}
