
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Backend.Tests
{
    public class DatabaseContextTests : IDisposable
    {
        private readonly DbContextOptions<DatabaseContext> _options;

        public DatabaseContextTests()
        {
            // Set up an in-memory database for testing
            _options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase("TestDatabase")
                .Options;
        }

        public void Dispose()
        {
            // Clean up after each test (optional)
            using var context = new DatabaseContext(_options);
            context.Database.EnsureDeleted();
        }

        [Fact]
        public async Task Can_Insert_And_Retrieve_Auction()
        {
            // Arrange
            using var context = new DatabaseContext(_options);

            // Create a user
            var user = new User
            {
                UserId = 1,
                Username = "TestUser",
                Email = "testuser@example.com",
                FirstName = "Test",
                LastName = "User",
                Country = "TestCountry"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Create an artwork (required fields: Description and ImageUrl)
            var artwork = new Artwork
            {
                ArtworkId = 1,
                Title = "Test Artwork",
                Artist = "Test Artist",
                Description = "Test Description", // Required
                ImageUrl = "http://example.com/image.jpg", // Required
                UserId = user.UserId
            };
            context.Artworks.Add(artwork);
            await context.SaveChangesAsync();

            // Create an auction
            var auction = new Auction
            {
                AuctionId = 1,
                ArtworkId = artwork.ArtworkId,
                StartingBid = 100,
                MinimumPrice = 200,
                IsClosed = false
            };

            // Act
            context.Auctions.Add(auction);
            await context.SaveChangesAsync();

            var retrievedAuction = await context.Auctions
                .Include(a => a.Artwork)
                .FirstOrDefaultAsync(a => a.AuctionId == auction.AuctionId);

            // Assert
            Assert.NotNull(retrievedAuction);
            Assert.Equal(100, retrievedAuction.StartingBid);
            Assert.Equal("Test Artwork", retrievedAuction.Artwork.Title);
        }

        [Fact]
        public async Task ForeignKey_Constraint_Works()
        {
            // Arrange
            using var context = new DatabaseContext(_options);

            // Create a user
            var user = new User
            {
                UserId = 2,
                Username = "ForeignKeyUser",
                Email = "foreignkey@example.com",
                FirstName = "Foreign",
                LastName = "Key",
                Country = "KeyCountry"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Create an artwork
            var artwork = new Artwork
            {
                ArtworkId = 2,
                Title = "ForeignKey Artwork",
                Artist = "ForeignKey Artist",
                Description = "Test Description",
                ImageUrl = "http://example.com/image.jpg",
                UserId = user.UserId
            };
            context.Artworks.Add(artwork);
            await context.SaveChangesAsync();

            // Create an auction
            var auction = new Auction
            {
                AuctionId = 2,
                ArtworkId = artwork.ArtworkId,
                StartingBid = 100,
                MinimumPrice = 200,
                IsClosed = false
            };

            // Act
            context.Auctions.Add(auction);
            await context.SaveChangesAsync();

            // Retrieve auction and check foreign key relationship
            var retrievedAuction = await context.Auctions
                .Include(a => a.Artwork)
                .FirstOrDefaultAsync(a => a.AuctionId == auction.AuctionId);

            // Assert
            Assert.NotNull(retrievedAuction);
            Assert.Equal(auction.AuctionId, retrievedAuction.AuctionId);
            Assert.Equal(artwork.ArtworkId, retrievedAuction.Artwork.ArtworkId);
        }

        [Fact]
        public async Task Can_Insert_And_Retrieve_User()
        {
            // Arrange
            using var context = new DatabaseContext(_options);

            var user = new User
            {
                UserId = 3, // Ensure unique key
                Username = "NewUser",
                Email = "newuser@example.com",
                FirstName = "New",
                LastName = "User",
                Country = "NewCountry"
            };

            // Act
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var retrievedUser = await context.Users
                .FirstOrDefaultAsync(u => u.UserId == user.UserId);

            // Assert
            Assert.NotNull(retrievedUser);
            Assert.Equal("NewUser", retrievedUser.Username);
            Assert.Equal("newuser@example.com", retrievedUser.Email);
        }

        [Fact]
        public async Task Cascade_Delete_Works()
        {
            // Arrange
            using var context = new DatabaseContext(_options);

            // Create a user
            var user = new User
            {
                UserId = 4, // Ensure unique key
                Username = "CascadeUser",
                Email = "cascade@example.com",
                FirstName = "Cascade",
                LastName = "Test",
                Country = "CascadeCountry"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Create an artwork
            var artwork = new Artwork
            {
                ArtworkId = 4, // Ensure unique key
                Title = "Cascade Test Artwork",
                Artist = "Cascade Artist",
                Description = "Description for Cascade Test",
                ImageUrl = "http://example.com/cascade.jpg",
                UserId = user.UserId
            };
            context.Artworks.Add(artwork);
            await context.SaveChangesAsync();

            // Act
            context.Users.Remove(user);
            await context.SaveChangesAsync();

            // Assert
            var retrievedArtwork = await context.Artworks
                .FirstOrDefaultAsync(a => a.ArtworkId == artwork.ArtworkId);
        }
    }
}
