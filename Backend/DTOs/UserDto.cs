namespace Backend.DTOs
{
    public class UserDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        public required  string Country { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
