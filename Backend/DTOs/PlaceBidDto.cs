using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class PlaceBidDto
    {
        [Required]
        public int AuctionId { get; set; }

        [Required]
        public decimal BidAmount { get; set; }
    }
}
