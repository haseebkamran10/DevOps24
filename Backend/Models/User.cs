using System;
using System.Collections.Generic; // Make sure to include this for ICollection
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? AddressLine { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        [Required]
        public string Country { get; set; } = string.Empty;

        // Ensure that the Artworks collection is correctly defined
        public virtual ICollection<Artwork> Artworks { get; set; } = new HashSet<Artwork>();
    }
}
