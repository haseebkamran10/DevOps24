using Microsoft.EntityFrameworkCore;
using DevOps24.Models;
using DevOps24.Data; // Adjust based on your project structure

namespace DevOps24.Data
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } 
    }
}
