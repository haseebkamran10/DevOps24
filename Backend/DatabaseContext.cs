using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; } // Manage users
        public DbSet<Artwork> Artworks { get; set; } // Manage artworks

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the User table
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.FirstName).HasColumnName("first_name");
                entity.Property(e => e.LastName).HasColumnName("last_name");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number").IsRequired(false);
                entity.Property(e => e.AddressLine).HasColumnName("address_line").IsRequired(false);
                entity.Property(e => e.City).HasColumnName("city").IsRequired(false);
                entity.Property(e => e.Zip).HasColumnName("zip_code").IsRequired(false);
                entity.Property(e => e.Country).HasColumnName("country");
            });

            // Configure the Artwork table
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

                // Relationship: each artwork is associated with one user
                entity.HasOne(d => d.User) // Navigation property in Artwork
                    .WithMany(p => p.Artworks) // Navigation property in User
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade); // Delete artworks if the user is deleted
            });
        }
    }
}
