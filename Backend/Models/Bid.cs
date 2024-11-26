using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Bid
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BidId { get; set; }

        [ForeignKey("Auction")]
        public int AuctionId { get; set; }
        public Auction Auction { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal BidAmount { get; set; }

        [Column(TypeName = "timestamp without time zone")]
        public DateTime BidTime { get; set; }

        [ForeignKey("Session")]
        public Guid? SessionId { get; set; }
        public Session Session { get; set; }
    }
}
