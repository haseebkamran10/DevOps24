using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class BidController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public BidController(DatabaseContext context)
        {
            _context = context;
        }

      
        [HttpPost("place")]
        public async Task<IActionResult> PlaceBidAsync([FromBody] BidDto bidDto)
        {
            if (string.IsNullOrEmpty(bidDto.PhoneNumber))
            {
                return BadRequest("The phone number is required.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
               
                var user = await _context.Users.SingleOrDefaultAsync(u => u.PhoneNumber == bidDto.PhoneNumber);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

       
                var activeSession = await _context.Sessions
                    .FirstOrDefaultAsync(s => s.UserId == user.UserId && s.ExpiresAt > DateTime.UtcNow);
                if (activeSession == null)
                {
                    return Unauthorized("No active session found. Please start a session first.");
                }

            
                var auction = await _context.Auctions.FirstOrDefaultAsync(a => a.AuctionId == bidDto.AuctionId && !a.IsClosed);
                if (auction == null)
                {
                    return NotFound("Auction not found or is already closed.");
                }

         
                if (bidDto.BidAmount <= auction.CurrentBid)
                {
                    return BadRequest("Bid amount must be higher than the current bid.");
                }

               
                auction.CurrentBid = bidDto.BidAmount;
                auction.UpdatedAt = DateTime.UtcNow;

          
                var bid = new Bid
                {
                    AuctionId = bidDto.AuctionId,
                    UserId = user.UserId,
                    BidAmount = bidDto.BidAmount,
                    BidTime = DateTime.UtcNow, 
                    SessionId = activeSession.SessionId
                };

                await _context.Bids.AddAsync(bid);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Bid placed successfully.", bidId = bid.BidId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        
        [HttpGet("auction/{auctionId}")]
        public async Task<IActionResult> GetBidsForAuctionAsync(int auctionId)
        {
            var bids = await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .Include(b => b.User)
                .ToListAsync();

            if (bids == null || !bids.Any())
            {
                return NotFound("No bids found for this auction.");
            }

            return Ok(bids);
        }
    }
}
