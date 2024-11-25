using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class Session
    {
        public Guid SessionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public int? UserId { get; set; }
        
        // Navigation property to User
        public User User { get; set; }
        
        // Navigation property to Bid
        public List<Bid> Bids { get; set; }
    }
}
