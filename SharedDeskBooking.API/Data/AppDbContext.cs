using Microsoft.EntityFrameworkCore;
using SharedDeskBooking.API.Models;

namespace SharedDeskBooking.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Desk> Desks { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
    }
}
