using Microsoft.EntityFrameworkCore;
using Xunit;

public class DatabaseTests
{
    [Fact]
    public void CanConnectToDatabase()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseNpgsql("Host=localhost;Database=mydb;Username=myuser;Password=mypassword")
            .Options;

        using (var context = new DatabaseContext(options))
        {
            // Ensure the database can be connected to
            Assert.True(context.Database.CanConnect());
        }
    }
}
