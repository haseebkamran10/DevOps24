
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Auction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AuctionId { get; set; }

        [ForeignKey("Artwork")]
        public int ArtworkId { get; set; }
        public Artwork Artwork { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal StartingBid { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? CurrentBid { get; set; } 

        [Column(TypeName = "decimal(18, 2)")]
        public decimal MinimumPrice { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public bool IsClosed { get; set; } 

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }
}
