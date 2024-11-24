using System.Collections.Generic;

namespace Backend.Models
{
    public class Auction
    {
        public int AuctionId { get; set; }
        public int ArtworkId { get; set; }
        public decimal StartingBid { get; set; }
        public decimal CurrentBid { get; set; }
        public decimal SecretThreshold { get; set; } // The hidden threshold
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsClosed { get; set; }

        // Navigation property for related bids
        public ICollection<Bid>? Bids { get; set; }
    }
}
