using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Models {
    

 public class Bid
    {
        public int BidId { get; set; }
        public int AuctionId { get; set; }
        public int UserId { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime BidTime { get; set; }
    }
}