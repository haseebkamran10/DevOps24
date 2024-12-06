namespace Backend.DTOs
{
    public class BidDto
    {
        public required string PhoneNumber { get; set; } 
        public int AuctionId { get; set; }      
        public decimal BidAmount { get; set; } 
    }
}
