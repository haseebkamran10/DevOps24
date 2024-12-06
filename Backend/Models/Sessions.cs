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
        
        public User User { get; set; }
        public List<Bid> Bids { get; set; }
    }
}
