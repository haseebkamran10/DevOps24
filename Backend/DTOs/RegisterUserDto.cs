using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string Username { get; set; } // Let users choose their username

        [Required]
        public string AddressLine { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Zip { get; set; }

        [Required]
        public string Country { get; set; }
    }
}
