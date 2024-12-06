
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Xunit;

namespace Backend.Tests
{
    public class UserControllerTests
    {
        private readonly Mock<ILogger<UserController>> _mockLogger;
        private readonly DbContextOptions<DatabaseContext> _options;

        public UserControllerTests()
        {

            _options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase("TestDatabase")
                .Options;

            _mockLogger = new Mock<ILogger<UserController>>();
        }

        [Fact]
        public async Task AddUser_Should_Return_Ok_When_User_Added()
        {
          
            using var context = new DatabaseContext(_options);
            var controller = new UserController(context, _mockLogger.Object);

            var userDto = new RegisterUserDto
            {
                FirstName = "John",
                LastName = "Doe",
                Username = "john_doe",
                Email = "john.doe@example.com",
                PhoneNumber = "123456789",
                AddressLine = "123 Main St",
                City = "City",
                Zip = "12345",
                Country = "Country"
            };

        
            var result = await controller.AddUser(userDto);

         
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value as dynamic;

            Assert.NotNull(response);
            Assert.Equal("User added successfully.", response.message);
            Assert.True(response.userId > 0); 
        }

        [Fact]
        public async Task GetUser_Should_Return_User_When_Found()
        {
         
            using var context = new DatabaseContext(_options);
            var user = new User
            {
                FirstName = "Jane",
                LastName = "Doe",
                Username = "jane_doe",
                Email = "jane.doe@example.com",
                PhoneNumber = "987654321",
                AddressLine = "456 Main St",
                City = "City",
                Zip = "67890",
                Country = "Country",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var controller = new UserController(context, _mockLogger.Object);

   
            var result = await controller.GetUser(user.UserId);

        
            var okResult = Assert.IsType<OkObjectResult>(result);
            var retrievedUser = Assert.IsType<User>(okResult.Value);

            Assert.Equal(user.UserId, retrievedUser.UserId);
            Assert.Equal(user.Username, retrievedUser.Username);
            Assert.Equal(user.Email, retrievedUser.Email);
        }

        [Fact]
        public async Task GetUser_Should_Return_NotFound_When_User_Not_Found()
        {
            
            using var context = new DatabaseContext(_options);
            var controller = new UserController(context, _mockLogger.Object);

     
            var result = await controller.GetUser(999);

        
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("User not found.", notFoundResult.Value);
        }

        [Fact]
        public async Task GetUserByPhoneNumber_Should_Return_User_When_Found()
        {
          
            using var context = new DatabaseContext(_options);
            var user = new User
            {
                FirstName = "Mary",
                LastName = "Jane",
                Username = "mary_jane",
                Email = "mary.jane@example.com",
                PhoneNumber = "5551234567",
                AddressLine = "789 Main St",
                City = "Metropolis",
                Zip = "23456",
                Country = "Country",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var controller = new UserController(context, _mockLogger.Object);

          
            var result = await controller.GetUserByPhoneNumber(user.PhoneNumber);

       
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value as dynamic;

            Assert.NotNull(response);
            Assert.Equal(user.FirstName, response.FirstName);
            Assert.Equal(user.PhoneNumber, response.PhoneNumber);
        }

        [Fact]
        public async Task GetUserByPhoneNumber_Should_Return_NotFound_When_User_Not_Found()
        {
           
            using var context = new DatabaseContext(_options);
            var controller = new UserController(context, _mockLogger.Object);

            
            var result = await controller.GetUserByPhoneNumber("5550000000"); 

       
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("User not found.", notFoundResult.Value);
        }
    }
}
