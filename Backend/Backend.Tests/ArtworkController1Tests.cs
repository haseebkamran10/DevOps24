/*
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Controllers;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Backend.Tests
{
    public class ArtworkControllerTests
    {
        private readonly DatabaseContext _context;
        private readonly ArtworkController _controller;

        public ArtworkControllerTests()
        {
            // Initialize In-Memory Database
            var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new DatabaseContext(options);

            // Seed test data
            _context.Users.Add(new User
            {
                UserId = 1,
                PhoneNumber = "1234567890",
                LastSessionId = Guid.NewGuid()
            });
            _context.SaveChanges();

            // Initialize controller
            _controller = new ArtworkController(_context);
        }

        [Fact]
        public async Task CreateArtworkAsync_ReturnsOk_WhenArtworkCreated()
        {
            // Arrange
            var mockFile = CreateMockFile("test.jpg", "Fake file content");
            var artworkDto = new CreateArtworkDto
            {
                Title = "Test Artwork",
                Description = "Test Description",
                Artist = "Test Artist",
                PhoneNumber = "1234567890",
                ImageFile = mockFile.Object
            };

            // Act
            var result = await _controller.CreateArtworkAsync(artworkDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
             Assert.NotNull(okResult.Value); // Ensure Value is not null
            Assert.Contains("Artwork created successfully", okResult.Value.ToString());
        }

        [Fact]
        public async Task CreateArtworkAsync_ReturnsBadRequest_WhenPhoneNumberMissing()
        { var dummyFile = new Mock<IFormFile>().Object; // Create a dummy, non-null file
            // Arrange
            var artworkDto = new CreateArtworkDto
            {
                Title = "Test Artwork",
                Description = "Test Description",
                Artist = "Test Artist",
                ImageFile =dummyFile
            };

            // Act
            var result = await _controller.CreateArtworkAsync(artworkDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("The phone number is required.", badRequestResult.Value);
        }

        [Fact]
        public async Task CreateArtworkAsync_ReturnsBadRequest_WhenImageFileMissing()
        {
            // Arrange
            var dummyFile = new Mock<IFormFile>().Object; // Create a dummy, non-null file
            var artworkDto = new CreateArtworkDto
            {
                Title = "Test Artwork",
                Description = "Test Description",
                Artist = "Test Artist",
                PhoneNumber = "1234567890",
                ImageFile =dummyFile
            };

            // Act
            var result = await _controller.CreateArtworkAsync(artworkDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("An image file is required.", badRequestResult.Value);
        }

        [Fact]
        public async Task CreateArtworkAsync_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var mockFile = CreateMockFile("test.jpg", "Fake file content");
            var artworkDto = new CreateArtworkDto
            {
                Title = "Test Artwork",
                Description = "Test Description",
                Artist = "Test Artist",
                PhoneNumber = "NonExistentPhoneNumber",
                ImageFile = mockFile.Object
            };

            // Act
            var result = await _controller.CreateArtworkAsync(artworkDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("User not found.", notFoundResult.Value);
        }

        private Mock<IFormFile> CreateMockFile(string fileName, string content)
        {
            var mockFile = new Mock<IFormFile>();
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            mockFile.Setup(_ => _.FileName).Returns(fileName);
            mockFile.Setup(_ => _.Length).Returns(stream.Length);
            mockFile.Setup(_ => _.OpenReadStream()).Returns(stream);
            mockFile.Setup(_ => _.ContentType).Returns("image/jpeg");

            return mockFile;
        }
    }
}
*/