using Microsoft.EntityFrameworkCore;
using DevOps24.Models;

namespace DevOps24.Data
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Explicitly map the User entity to the "Users" table (optional)
            modelBuilder.Entity<User>().ToTable("Users");

            // Configure other entities and relationships here if necessary
        }
    }
}
