namespace Backend.DTOs
{
    public class BidDto
    {
        public string PhoneNumber { get; set; } // For user validation
        public int AuctionId { get; set; }      // Auction ID
        public decimal BidAmount { get; set; } // Bid Amount
    }
}
