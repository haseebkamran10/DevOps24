namespace Backend.DTOs
{
    public class UserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.MinValue; // Default value
        public DateTime UpdatedAt { get; set; } = DateTime.MinValue; // Default value
    }
}
