namespace DevOps24.Models
{
    public class User
    {
        public int Id { get; set; } // Assuming there's an Id property as the primary key
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AddressLine { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
        public string PasswordHash { get; set; } // Store the hashed password

        // Add other properties as needed
    }
}
