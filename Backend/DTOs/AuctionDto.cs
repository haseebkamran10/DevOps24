namespace Backend.DTOs
{
    public class AuctionDto
    {
        public string PhoneNumber { get; set; }
        public int ArtworkId { get; set; } 
        public decimal StartingBid { get; set; } 
        public decimal SecretThreshold { get; set; } 
        public int DurationHours { get; set; }
    }
}
