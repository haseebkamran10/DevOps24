/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

public class BidControllerTests
{
    private readonly DbContextOptions<DatabaseContext> _options;

    public BidControllerTests()
    {
        _options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(databaseName: "BidTestDatabase")
            .Options;
    }

    [Fact]
    public async Task PlaceBidAsync_Should_Return_BidId_When_Bid_Is_Valid()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        
        var user = new User
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "5551234567",
            Email = "john.doe@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);

        var auction = new Auction
        {
            AuctionId = 1,
            CurrentBid = 100,
            IsClosed = false,
            UpdatedAt = DateTime.UtcNow
        };
        context.Auctions.Add(auction);

        var session = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = user.UserId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };
        context.Sessions.Add(session);

        await context.SaveChangesAsync();

        var bidDto = new BidDto
        {
            PhoneNumber = "5551234567",
            AuctionId = 1,
            BidAmount = 150
        };

        var controller = new BidController(context);

        // Act
        var result = await controller.PlaceBidAsync(bidDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = okResult.Value as dynamic;
        Assert.NotNull(response.bidId);
    }

    [Fact]
    public async Task PlaceBidAsync_Should_Return_BadRequest_When_BidAmount_Lower_Than_CurrentBid()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        
        var user = new User
        {
            FirstName = "Alice",
            LastName = "Wonder",
            PhoneNumber = "5551122334",
            Email = "alice@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);

        var auction = new Auction
        {
            AuctionId = 1,
            CurrentBid = 100,
            IsClosed = false,
            UpdatedAt = DateTime.UtcNow
        };
        context.Auctions.Add(auction);

        var session = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = user.UserId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };
        context.Sessions.Add(session);

        await context.SaveChangesAsync();

        var bidDto = new BidDto
        {
            PhoneNumber = "5551122334",
            AuctionId = 1,
            BidAmount = 80 // Invalid bid amount
        };

        var controller = new BidController(context);

        // Act
        var result = await controller.PlaceBidAsync(bidDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Bid amount must be higher than the current bid.", badRequestResult.Value);
    }

    [Fact]
    public async Task PlaceBidAsync_Should_Return_NotFound_When_User_Not_Found()
    {
        // Arrange
        using var context = new DatabaseContext(_options);

        var auction = new Auction
        {
            AuctionId = 1,
            CurrentBid = 100,
            IsClosed = false,
            UpdatedAt = DateTime.UtcNow
        };
        context.Auctions.Add(auction);

        await context.SaveChangesAsync();

        var bidDto = new BidDto
        {
            PhoneNumber = "5559999999", // Non-existent phone number
            AuctionId = 1,
            BidAmount = 150
        };

        var controller = new BidController(context);

        // Act
        var result = await controller.PlaceBidAsync(bidDto);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User not found.", notFoundResult.Value);
    }

    [Fact]
    public async Task PlaceBidAsync_Should_Return_Unauthorized_When_Session_Expired()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        
        var user = new User
        {
            FirstName = "Bob",
            LastName = "Marley",
            PhoneNumber = "5559988776",
            Email = "bob@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);

        var auction = new Auction
        {
            AuctionId = 1,
            CurrentBid = 100,
            IsClosed = false,
            UpdatedAt = DateTime.UtcNow
        };
        context.Auctions.Add(auction);

        var expiredSession = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = user.UserId,
            CreatedAt = DateTime.UtcNow.AddHours(-2),
            ExpiresAt = DateTime.UtcNow.AddHours(-1) // Session expired
        };
        context.Sessions.Add(expiredSession);

        await context.SaveChangesAsync();

        var bidDto = new BidDto
        {
            PhoneNumber = "5559988776",
            AuctionId = 1,
            BidAmount = 150
        };

        var controller = new BidController(context);

        // Act
        var result = await controller.PlaceBidAsync(bidDto);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("No active session found. Please start a session first.", unauthorizedResult.Value);
    }

    [Fact]
    public async Task GetBidsForAuctionAsync_Should_Return_Bids_When_Bids_Exist()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        
        var user = new User
        {
            FirstName = "Charlie",
            LastName = "Brown",
            PhoneNumber = "5553344556",
            Email = "charlie.brown@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);

        var auction = new Auction
        {
            AuctionId = 1,
            CurrentBid = 100,
            IsClosed = false,
            UpdatedAt = DateTime.UtcNow
        };
        context.Auctions.Add(auction);

        var session = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = user.UserId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };
        context.Sessions.Add(session);

        var bid = new Bid
        {
            AuctionId = 1,
            UserId = user.UserId,
            BidAmount = 150,
            BidTime = DateTime.UtcNow,
            SessionId = session.SessionId
        };
        context.Bids.Add(bid);

        await context.SaveChangesAsync();

        var controller = new BidController(context);

        // Act
        var result = await controller.GetBidsForAuctionAsync(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var bids = Assert.IsAssignableFrom<System.Collections.Generic.List<Bid>>(okResult.Value);
        Assert.NotEmpty(bids);
    }

    [Fact]
    public async Task GetBidsForAuctionAsync_Should_Return_NotFound_When_No_Bids_Exist()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        
        var auction = new Auction
        {
            AuctionId = 1,
            CurrentBid = 100,
            IsClosed = false,
            UpdatedAt = DateTime.UtcNow
        };
        context.Auctions.Add(auction);

        await context.SaveChangesAsync();

        var controller = new BidController(context);

        // Act
        var result = await controller.GetBidsForAuctionAsync(1);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("No bids found for this auction.", notFoundResult.Value);
    }
}
*/