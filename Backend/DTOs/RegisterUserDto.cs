using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string PhoneNumber { get; set; }

        public required string Username { get; set; } // Optionally required based on your application logic

        public required string AddressLine { get; set; }

        public required string City { get; set; }

        public required string Zip { get; set; }

        [Required]
        public required string Country { get; set; }
    }
}
