using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
    {
        public required DbSet<User> Users { get; set; }
        public required DbSet<Auction> Auctions { get; set; }
        public required DbSet<Bid> Bids { get; set; }
        public required DbSet<Artwork> Artworks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users"); // Map to the "users" table

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.FirstName).HasColumnName("first_name");
                entity.Property(e => e.LastName).HasColumnName("last_name");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
                entity.Property(e => e.AddressLine).HasColumnName("address_line");
                entity.Property(e => e.City).HasColumnName("city");
                entity.Property(e => e.Zip).HasColumnName("zip_code");
                entity.Property(e => e.Country).HasColumnName("country");
            });
             modelBuilder.Entity<Bid>(entity =>
            {
                entity.ToTable("bids");
                entity.Property(e => e.BidId).HasColumnName("bid_id");
                entity.Property(e => e.AuctionId).HasColumnName("auction_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.BidAmount).HasColumnName("bid_amount");
                entity.Property(e => e.BidTime).HasColumnName("bid_time");
            });
               modelBuilder.Entity<Auction>(entity =>
            {
                entity.ToTable("auctions");
                entity.Property(e => e.AuctionId).HasColumnName("auction_id");
                entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
                entity.Property(e => e.StartingBid).HasColumnName("starting_bid");
                entity.Property(e => e.CurrentBid).HasColumnName("current_bid");
                entity.Property(e => e.SecretThreshold).HasColumnName("minimum_price");
                entity.Property(e => e.StartTime).HasColumnName("start_time");
                entity.Property(e => e.EndTime).HasColumnName("end_time");
                entity.Property(e => e.IsClosed).HasColumnName("is_closed");
            });
             modelBuilder.Entity<Artwork>(entity =>
            {
                entity.ToTable("artworks");

                entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
                entity.Property(e => e.Title).HasColumnName("title");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Artist).HasColumnName("artist");
                entity.Property(e => e.ImageUrl).HasColumnName("image_url");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Artworks) 
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
     });
        }
    }
}
