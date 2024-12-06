namespace Backend.DTOs
{
    public class CreateArtworkDto
    {
        public required string PhoneNumber { get; set; } 
        public required string Title { get; set; }     
        public required string Description { get; set; } 
        public required string Artist { get; set; }    
        public required IFormFile ImageFile { get; set; } 
    }
}
