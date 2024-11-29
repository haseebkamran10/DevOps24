using System;

namespace Backend.Models
{
    public class Payment
    {
        public int PaymentId { get; set; } 
        public int AuctionId { get; set; } 
        public int UserId { get; set; }   
        public decimal Amount { get; set; }
        public DateTime PaymentTime { get; set; } 
        public required string Status { get; set; } 
    }
}
