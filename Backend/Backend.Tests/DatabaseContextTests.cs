
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
            _options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase("TestDatabase")
                .Options;
        }

        public void Dispose()
        {
            using var context = new DatabaseContext(_options);
            context.Database.EnsureDeleted();
        }

        [Fact]
        public async Task Can_Insert_And_Retrieve_Auction()
        {
            using var context = new DatabaseContext(_options);

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

            var artwork = new Artwork
            {
                ArtworkId = 1,
                Title = "Test Artwork",
                Artist = "Test Artist",
                Description = "Test Description",
                ImageUrl = "http://example.com/image.jpg",
                UserId = user.UserId
            };
            context.Artworks.Add(artwork);
            await context.SaveChangesAsync();

            var auction = new Auction
            {
                AuctionId = 1,
                ArtworkId = artwork.ArtworkId,
                StartingBid = 100,
                MinimumPrice = 200,
                IsClosed = false
            };


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

            using var context = new DatabaseContext(_options);

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


            var auction = new Auction
            {
                AuctionId = 2,
                ArtworkId = artwork.ArtworkId,
                StartingBid = 100,
                MinimumPrice = 200,
                IsClosed = false
            };

          
            context.Auctions.Add(auction);
            await context.SaveChangesAsync();


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
 
            using var context = new DatabaseContext(_options);

            var user = new User
            {
                UserId = 3, 
                Username = "NewUser",
                Email = "newuser@example.com",
                FirstName = "New",
                LastName = "User",
                Country = "NewCountry"
            };

 
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var retrievedUser = await context.Users
                .FirstOrDefaultAsync(u => u.UserId == user.UserId);

        
            Assert.NotNull(retrievedUser);
            Assert.Equal("NewUser", retrievedUser.Username);
            Assert.Equal("newuser@example.com", retrievedUser.Email);
        }

        [Fact]
        public async Task Cascade_Delete_Works()
        {
          
            using var context = new DatabaseContext(_options);

         
            var user = new User
            {
                UserId = 4,
                Username = "CascadeUser",
                Email = "cascade@example.com",
                FirstName = "Cascade",
                LastName = "Test",
                Country = "CascadeCountry"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

       
            var artwork = new Artwork
            {
                ArtworkId = 4,
                Title = "Cascade Test Artwork",
                Artist = "Cascade Artist",
                Description = "Description for Cascade Test",
                ImageUrl = "http://example.com/cascade.jpg",
                UserId = user.UserId
            };
            context.Artworks.Add(artwork);
            await context.SaveChangesAsync();

       
            context.Users.Remove(user);
            await context.SaveChangesAsync();

      
            var retrievedArtwork = await context.Artworks
                .FirstOrDefaultAsync(a => a.ArtworkId == artwork.ArtworkId);
        }
    }
}
