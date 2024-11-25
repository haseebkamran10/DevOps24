using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? AddressLine { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        public string Country { get; set; } = string.Empty;
        public Guid? LastSessionId { get; set; }

        // Navigation properties
        public virtual ICollection<Artwork> Artworks { get; set; } = new HashSet<Artwork>();
        public virtual ICollection<Session> Sessions { get; set; } = new HashSet<Session>();
    }
}
