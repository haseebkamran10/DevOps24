using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<Artwork> Artworks { get; set; }
        public DbSet<Session> Sessions { get; set; } // Declare the DbSet for Sessions

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Username).HasColumnName("username").IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").IsRequired();
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.FirstName).HasColumnName("first_name").IsRequired();
                entity.Property(e => e.LastName).HasColumnName("last_name").IsRequired();
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
                entity.Property(e => e.AddressLine).HasColumnName("address_line");
                entity.Property(e => e.City).HasColumnName("city");
                entity.Property(e => e.Zip).HasColumnName("zip_code");
                entity.Property(e => e.Country).HasColumnName("country").IsRequired();
                entity.Property(e => e.LastSessionId).HasColumnName("last_session_id");
            });

            // Bid entity configuration
  modelBuilder.Entity<Bid>(entity =>
{
    entity.ToTable("bids");
    entity.HasKey(e => e.BidId);
    entity.Property(e => e.BidId).HasColumnName("bid_id");
    entity.Property(e => e.AuctionId).HasColumnName("auction_id");
    entity.Property(e => e.UserId).HasColumnName("user_id");
    entity.Property(e => e.BidAmount)
          .HasColumnName("bid_amount")
          .HasColumnType("decimal(18, 2)");
    entity.Property(e => e.BidTime).HasColumnName("bid_time"); // Consistent with other entities
    entity.Property(e => e.SessionId).HasColumnName("session_id").IsRequired(false);

    entity.HasOne(e => e.Session)
          .WithMany(s => s.Bids)
          .HasForeignKey(e => e.SessionId);
});

            // Auction entity configuration
           modelBuilder.Entity<Auction>(entity =>
            {
                entity.ToTable("auctions");
                entity.HasKey(a => a.AuctionId);

                entity.Property(a => a.AuctionId).HasColumnName("auction_id");
                entity.Property(a => a.ArtworkId).HasColumnName("artwork_id");
                entity.Property(a => a.StartingBid).HasColumnName("starting_bid");
                entity.Property(a => a.CurrentBid).HasColumnName("current_bid").IsRequired(false);
                entity.Property(a => a.MinimumPrice).HasColumnName("minimum_price");
                entity.Property(a => a.StartTime).HasColumnName("start_time");
                entity.Property(a => a.EndTime).HasColumnName("end_time");
                entity.Property(a => a.IsClosed).HasColumnName("is_closed");
                entity.Property(a => a.CreatedAt).HasColumnName("created_at");
                entity.Property(a => a.UpdatedAt).HasColumnName("updated_at");

                // Configure relationship with Bid
                entity.HasMany(a => a.Bids)
                      .WithOne(b => b.Auction)
                      .HasForeignKey(b => b.AuctionId);
            });

            // Artwork entity configuration
            modelBuilder.Entity<Artwork>(entity =>
            {
                entity.ToTable("artworks");
                entity.HasKey(e => e.ArtworkId);
                entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
                entity.Property(e => e.Title).HasColumnName("title").IsRequired();
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Artist).HasColumnName("artist").IsRequired();
                entity.Property(e => e.ImageUrl).HasColumnName("image_url");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(e => e.User).WithMany(u => u.Artworks).HasForeignKey(e => e.UserId);
            });

            // Session entity configuration
            modelBuilder.Entity<Session>(entity =>
            {
                entity.ToTable("sessions");
                entity.HasKey(e => e.SessionId);
                entity.Property(e => e.SessionId).HasColumnName("session_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired(false);

                entity.HasOne(e => e.User).WithMany(u => u.Sessions).HasForeignKey(e => e.UserId);
            });
        }
    }
}
