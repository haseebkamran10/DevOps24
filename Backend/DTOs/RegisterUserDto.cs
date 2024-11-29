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

        public string Username { get; set; } // Optionally required based on your application logic

        public string AddressLine { get; set; }

        public string City { get; set; }

        public string Zip { get; set; }

        [Required]
        public string Country { get; set; }
    }
}
