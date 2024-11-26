namespace Backend.DTOs
{
    public class CreateArtworkDto
    {
        public string PhoneNumber { get; set; } // To validate the user
        public string Title { get; set; }       // Artwork title
        public string Description { get; set; } // Artwork description
        public string Artist { get; set; }     // Artist's name
        public IFormFile ImageFile { get; set; } // File for the artwork image
    }
}
