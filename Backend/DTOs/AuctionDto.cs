namespace Backend.DTOs
{
    public class AuctionDto
    {
        public string PhoneNumber { get; set; } // To validate user and session
        public int ArtworkId { get; set; } // Artwork to be auctioned
        public decimal StartingBid { get; set; } // Starting bid for the auction
        public decimal SecretThreshold { get; set; } // Minimum acceptable price
        public int DurationHours { get; set; } // Auction duration in hours
    }
}
