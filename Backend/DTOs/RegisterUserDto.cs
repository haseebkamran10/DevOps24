using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "First name is required")]
        [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [MaxLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string PhoneNumber { get; set; }

        [MaxLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string AddressLine { get; set; }

        [MaxLength(50, ErrorMessage = "City cannot exceed 50 characters")]
        public string City { get; set; }

        [MaxLength(20, ErrorMessage = "Zip code cannot exceed 20 characters")]
        public string Zip { get; set; }

        [MaxLength(50, ErrorMessage = "Country cannot exceed 50 characters")]
        public string Country { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }
    }
}
