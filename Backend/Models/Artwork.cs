namespace Backend.Models
{
    public class Artwork
    {
        public int ArtworkId { get; set; }
        public  required string Title { get; set; }
        public  required string Description { get; set; }
        public  required string Artist { get; set; }
        public  required string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
    }
}
