/*
using Microsoft.AspNetCore.Mvc;
using Xunit;
using Backend.Controllers;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Tests
{
    public class AuctionControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
internal AuctionControllerTests(WebApplicationFactory<Program> factory)
{
    _factory = factory;
}


        private async Task<DatabaseContext> GetDbContextAsync()
        {
            var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
            await context.Database.EnsureDeletedAsync();
            await context.Database.EnsureCreatedAsync();
            return context;
        }

        [Fact]
        public async Task StartAuctionAsync_Should_Return_Ok_When_Valid_Data()
        {
            // Arrange
            var context = await GetDbContextAsync();
            var user = new User { FirstName = "John", LastName = "Doe", PhoneNumber = "5551234567", Email = "john.doe@example.com" };
            context.Users.Add(user);
            var artwork = new Artwork { ArtworkId = 1, UserId = user.UserId, Title = "Beautiful Painting", Description = "A beautiful piece of art." };
            context.Artworks.Add(artwork);
            var session = new Session { SessionId = Guid.NewGuid(), UserId = user.UserId, ExpiresAt = DateTime.UtcNow.AddHours(1) };
            context.Sessions.Add(session);
            await context.SaveChangesAsync();

            var auctionDto = new AuctionDto
            {
                PhoneNumber = "5551234567",
                ArtworkId = 1,
                StartingBid = 100,
                SecretThreshold = 200,
                DurationHours = 1
            };

            var controller = new AuctionController(context, null);  // Logger is injected, but we pass null for the sake of this test

            // Act
            var result = await controller.StartAuctionAsync(auctionDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value as dynamic;
            Assert.NotNull(response.auctionId);
            Assert.Equal("Auction started successfully.", response.message);
        }

        [Fact]
        public async Task StartAuctionAsync_Should_Return_NotFound_When_User_Not_Found()
        {
            // Arrange
            var context = await GetDbContextAsync();
            var auctionDto = new AuctionDto
            {
                PhoneNumber = "5551234567",  // User does not exist
                ArtworkId = 1,
                StartingBid = 100,
                SecretThreshold = 200,
                DurationHours = 1
            };

            var controller = new AuctionController(context, null);

            // Act
            var result = await controller.StartAuctionAsync(auctionDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("User not found.", notFoundResult.Value);
        }

        [Fact]
        public async Task StartAuctionAsync_Should_Return_BadRequest_When_Artwork_Already_Auctioned()
        {
            // Arrange
            var context = await GetDbContextAsync();
            var user = new User { FirstName = "John", LastName = "Doe", PhoneNumber = "5551234567", Email = "john.doe@example.com" };
            context.Users.Add(user);
            var artwork = new Artwork { ArtworkId = 1, UserId = user.UserId, Title = "Beautiful Painting", Description = "A beautiful piece of art." };
            context.Artworks.Add(artwork);
            var session = new Session { SessionId = Guid.NewGuid(), UserId = user.UserId, ExpiresAt = DateTime.UtcNow.AddHours(1) };
            context.Sessions.Add(session);
            var existingAuction = new Auction { ArtworkId = 1, StartingBid = 100, MinimumPrice = 200, IsClosed = false };
            context.Auctions.Add(existingAuction);
            await context.SaveChangesAsync();

            var auctionDto = new AuctionDto
            {
                PhoneNumber = "5551234567",
                ArtworkId = 1,
                StartingBid = 100,
                SecretThreshold = 200,
                DurationHours = 1
            };

            var controller = new AuctionController(context, null);

            // Act
            var result = await controller.StartAuctionAsync(auctionDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("An active auction already exists for this artwork.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetActiveAuctionsAsync_Should_Return_Active_Auctions()
        {
            // Arrange
            var context = await GetDbContextAsync();
            var user = new User { FirstName = "John", LastName = "Doe", PhoneNumber = "5551234567", Email = "john.doe@example.com" };
            context.Users.Add(user);
            var artwork = new Artwork { ArtworkId = 1, UserId = user.UserId, Title = "Beautiful Painting", Description = "A beautiful piece of art." };
            context.Artworks.Add(artwork);
            var session = new Session { SessionId = Guid.NewGuid(), UserId = user.UserId, ExpiresAt = DateTime.UtcNow.AddHours(1) };
            context.Sessions.Add(session);
            var auction = new Auction
            {
                ArtworkId = 1,
                StartingBid = 100,
                MinimumPrice = 200,
                StartTime = DateTime.UtcNow.AddMinutes(-10),
                EndTime = DateTime.UtcNow.AddHours(1),
                IsClosed = false
            };
            context.Auctions.Add(auction);
            await context.SaveChangesAsync();

            var controller = new AuctionController(context, null);

            // Act
            var result = await controller.GetActiveAuctionsAsync();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var auctions = Assert.IsType<System.Collections.Generic.List<Auction>>(okResult.Value);
            Assert.Single(auctions);
        }

        [Fact]
        public async Task EndAuctionAsync_Should_Return_Ok_When_Auction_Ended_Successfully()
        {
            // Arrange
            var context = await GetDbContextAsync();
            var user = new User { FirstName = "John", LastName = "Doe", PhoneNumber = "5551234567", Email = "john.doe@example.com" };
            context.Users.Add(user);
            var artwork = new Artwork { ArtworkId = 1, UserId = user.UserId, Title = "Beautiful Painting", Description = "A beautiful piece of art." };
            context.Artworks.Add(artwork);
            var session = new Session { SessionId = Guid.NewGuid(), UserId = user.UserId, ExpiresAt = DateTime.UtcNow.AddHours(1) };
            context.Sessions.Add(session);
            var auction = new Auction { ArtworkId = 1, StartingBid = 100, MinimumPrice = 200, IsClosed = false };
            context.Auctions.Add(auction);
            await context.SaveChangesAsync();

            var endAuctionDto = new EndAuctionDto { AuctionId = auction.AuctionId };

            var controller = new AuctionController(context, null);

            // Act
            var result = await controller.EndAuctionAsync(endAuctionDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value as dynamic;
            Assert.Equal($"Auction {auction.AuctionId} has been removed successfully.", response.message);
        }
    }

    public class WebApplicationFactory<T>
    {
    }
}
*/