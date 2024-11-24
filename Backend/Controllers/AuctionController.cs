using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public AuctionController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/auction/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuction(int id)
        {
            var auction = await _context.Auctions
                .Include(a => a.Bids)
                .FirstOrDefaultAsync(a => a.AuctionId == id);

            if (auction == null)
                return NotFound("Auction not found.");
              // Ensure auction.Bids is not null and get the highest bid amount
            var highestBid = auction.Bids?.Max(b => b.BidAmount) ?? 0;    

            return Ok(new
            {
                auction.AuctionId,
                auction.ArtworkId,
                auction.StartingBid,
                auction.CurrentBid,
                auction.StartTime,
                auction.EndTime,
                auction.IsClosed,
                HighestBid = highestBid,
            });
        }

        // POST: api/auction/bid
        [HttpPost("bid")]
        public async Task<IActionResult> PlaceBid([FromBody] PlaceBidDto bidDto)
        {
            var auction = await _context.Auctions.FindAsync(bidDto.AuctionId);

            if (auction == null || auction.IsClosed || auction.EndTime < DateTime.UtcNow)
                return BadRequest("Auction is not active or does not exist.");

            if (bidDto.BidAmount <= auction.CurrentBid)
                return BadRequest("Bid amount must be higher than the current bid.");

            var bid = new Bid
            {
                AuctionId = auction.AuctionId,
                UserId = 1, // Replace with user ID from authentication
                BidAmount = bidDto.BidAmount,
                BidTime = DateTime.UtcNow
            };

            _context.Bids.Add(bid);

            // Update auction's current bid
            auction.CurrentBid = bidDto.BidAmount;

            // Check if the secret threshold is met
            if (bidDto.BidAmount >= auction.SecretThreshold)
            {
                auction.IsClosed = true; // Close the auction
                return Ok(new { Message = "Congratulations! You won the auction!" });
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Bid placed successfully." });
        }
    }
}
