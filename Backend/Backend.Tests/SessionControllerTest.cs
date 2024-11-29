/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;
using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Moq;

public class SessionControllerTests
{
    private DbContextOptions<DatabaseContext> _options;

    public SessionControllerTests()
    {
        _options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;
    }

    [Fact]
    public async Task StartSessionAsync_Should_Return_SessionId_When_Successful()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        var user = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "johndoe@example.com",
            PhoneNumber = "5551234567",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var sessionDto = new StartSessionDto
        {
            PhoneNumber = "5551234567"
        };

        var controller = new SessionController(context);

        // Act
        var result = await controller.StartSessionAsync(sessionDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = okResult.Value as dynamic;
        Assert.NotNull(response.sessionId);
    }

    [Fact]
    public async Task StartSessionAsync_Should_Return_NotFound_When_User_Not_Found()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        var sessionDto = new StartSessionDto
        {
            PhoneNumber = "5550000000" // Non-existent phone number
        };

        var controller = new SessionController(context);

        // Act
        var result = await controller.StartSessionAsync(sessionDto);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User not found.", notFoundResult.Value);
    }

    [Fact]
    public async Task StartSessionAsync_Should_Return_Existing_Session_When_Active_Session_Exists()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        var user = new User
        {
            FirstName = "Jane",
            LastName = "Smith",
            Username = "janesmith",
            Email = "janesmith@example.com",
            PhoneNumber = "5559876543",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Start the first session
        var firstSession = new Session
        {
            SessionId = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId = user.UserId
        };
        context.Sessions.Add(firstSession);
        user.LastSessionId = firstSession.SessionId;
        await context.SaveChangesAsync();

        var sessionDto = new StartSessionDto
        {
            PhoneNumber = "5559876543"
        };

        var controller = new SessionController(context);

        // Act
        var result = await controller.StartSessionAsync(sessionDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = okResult.Value as dynamic;
        Assert.Equal(firstSession.SessionId, response.sessionId); // Verify same session is returned
    }

    [Fact]
    public async Task EndSession_Should_Return_Success_When_Session_Exists()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        var user = new User
        {
            FirstName = "Alice",
            LastName = "Wonder",
            Username = "alicewonder",
            Email = "alice@example.com",
            PhoneNumber = "5551122334",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var session = new Session
        {
            SessionId = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId = user.UserId
        };
        context.Sessions.Add(session);
        await context.SaveChangesAsync();

        var controller = new SessionController(context);

        // Act
        var result = controller.EndSession(session.SessionId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Session ended successfully.", okResult.Value);
    }

    [Fact]
    public void EndSession_Should_Return_NotFound_When_Session_Not_Found()
    {
        // Arrange
        using var context = new DatabaseContext(_options);
        var controller = new SessionController(context);

        // Act
        var result = controller.EndSession(Guid.NewGuid()); // Non-existent session ID

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("Session not found.", notFoundResult.Value);
    }
}
*/