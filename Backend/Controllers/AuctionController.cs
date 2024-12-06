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
            .Include(a => a.Bids) // Include related bids
            .FirstOrDefaultAsync(a => a.AuctionId == endAuctionDto.AuctionId);

        if (auction == null)
        {
            return NotFound("Auction not found.");
        }

        if (auction.IsClosed)
        {
            return BadRequest("Auction is already closed.");
        }

        // Determine the highest valid bid
        var winningBid = auction.Bids
            .Where(b => b.BidAmount >= auction.MinimumPrice) // Only bids meeting the threshold
            .OrderByDescending(b => b.BidAmount) // Sort by highest bid
            .FirstOrDefault();

        if (winningBid == null)
        {
            // Close auction with no winner
            auction.IsClosed = true;
            auction.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Auction {auction.AuctionId} ended with no valid winner.");
            return Ok(new { message = "Auction ended with no valid bids meeting the threshold." });
        }

        // Announce the winner
        var winner = new
        {
            userId = winningBid.UserId,
            userName = await _context.Users
                .Where(u => u.UserId == winningBid.UserId)
                .Select(u => u.FirstName) // Replace 'Name' with the actual user property if different
                .FirstOrDefaultAsync(),
            bidAmount = winningBid.BidAmount
        };

        // Update auction status and save the winner
        auction.IsClosed = true;
        auction.CurrentBid = winningBid.BidAmount;
        auction.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        // Log and return the winner details
        _logger.LogInformation($"Auction {auction.AuctionId} ended successfully. Winner: {winner.userName} (User {winner.userId}), Bid: {winner.bidAmount}.");

        return Ok(new
        {
            message = "Auction ended successfully.",
            auctionId = auction.AuctionId,
            winner
        });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        _logger.LogError($"Error ending auction {endAuctionDto.AuctionId}: {ex.Message}");
        return StatusCode(500, $"An error occurred: {ex.Message}");
    }
}



    }
}
