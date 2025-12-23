using Microsoft.EntityFrameworkCore;
using SharedDeskBooking.API.Data;
using SharedDeskBooking.API.Services;
using SharedDeskBooking.API.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Duomenų bazė (SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=desks.db"));

// 2. Dependency Injection
builder.Services.AddScoped<IDeskService, DeskService>();

// 3. CORS konfigūracija (Kad React [Vite] portu 5173 galėtų pasiekti API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 5. Duomenų užpildymas (Seeding) - tik testavimui
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated(); // Sukuria duomenų bazės failą, jei jo nėra
    if (!context.Desks.Any())
    {
        context.Desks.AddRange(
            new Desk { Number = 101, IsUnderMaintenance = false },
            new Desk { Number = 102, IsUnderMaintenance = false },
            new Desk { Number = 103, IsUnderMaintenance = true, MaintenanceInfo = "Sugedusi kėdė" },
            new Desk { Number = 104, IsUnderMaintenance = false },
            new Desk { Number = 105, IsUnderMaintenance = false }
        );
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 4. Įjunk CORS (turi eiti prieš Authorization)
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
