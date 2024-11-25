using System;

namespace Backend.DTOs
{
    public class SyncUserDto
    {
        public string SupabaseId { get; set; } // ID from Supabase, assuming it must always be present
        public string Email { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }  // Include first name
        public string LastName { get; set; }   // Include last name
        public string? PhoneNumber { get; set; } // Nullable if phone number might not be provided
        public string? AddressLine { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Zip { get; set; }
    }
}