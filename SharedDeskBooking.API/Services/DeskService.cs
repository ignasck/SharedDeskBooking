using Microsoft.EntityFrameworkCore;
using SharedDeskBooking.API.Data;
using SharedDeskBooking.API.DTOs;
using SharedDeskBooking.API.Models;

namespace SharedDeskBooking.API.Services
{
    public class DeskService : IDeskService
    {
        private readonly AppDbContext _context;

        public DeskService(AppDbContext context)
        {
            _context = context;
        }

        // Sis metodas grazina visus stalus ir ju aktualiausia busena.
        // Naudojame DateTime.UtcNow.Date, kad matytume visas siandienos rezervacijas.
        // Jei stalas turi bent viena aktyvia rezervacija dabar ar ateityje, jis rodomas kaip Reserved.
        public async Task<IEnumerable<DeskDto>> GetDesksAsync()
        {
            var desks = await _context.Desks.ToListAsync();
            var today = DateTime.UtcNow.Date;
            var now = DateTime.UtcNow;

            // Fetch active reservations ending today or later
            var reservations = await _context.Reservations
                .Where(r => r.IsActive && r.EndDate >= today)
                .OrderBy(r => r.StartDate)
                .ToListAsync();

            var deskDtos = desks.Select(d =>
            {
                var deskReservations = reservations.Where(r => r.DeskId == d.Id).ToList();

                // Current or next reservation
                var currentRes = deskReservations.FirstOrDefault(r => r.StartDate <= now && r.EndDate >= now);
                var nextRes = deskReservations.FirstOrDefault(r => r.StartDate > now);
                var displayRes = currentRes ?? nextRes;

                var status = DeskStatus.Open;
                if (d.IsUnderMaintenance)
                {
                    status = DeskStatus.Maintenance;
                }
                else if (displayRes != null)
                {
                    status = DeskStatus.Reserved;
                }

                return new DeskDto
                {
                    Id = d.Id,
                    Number = d.Number,
                    Status = status,
                    ReservedBy = displayRes?.UserFullName,
                    ReservedById = displayRes?.UserId,
                    ReservationStart = displayRes?.StartDate,
                    ReservationEnd = displayRes?.EndDate,
                    MaintenanceInfo = d.MaintenanceInfo,
                    CurrentReservationId = displayRes?.Id
                };
            }).ToList();

            return deskDtos;
        }

        // Rezervavimo logika: patikriname ar stalas nera remontuojamas ir ar nesidubliuoja laikai.
        // Naudojame AnyAsync su laiko palyginimu, kad uztikrintume duomenu bazes vientisuma.
        public async Task<bool> BookDeskAsync(BookingRequestDto request)
        {
            var desk = await _context.Desks.FindAsync(request.DeskId);
            if (desk == null || desk.IsUnderMaintenance)
            {
                return false;
            }

            // Check if there is an overlapping active reservation for this desk
            bool isOccupied = await _context.Reservations.AnyAsync(r =>
                r.DeskId == request.DeskId &&
                r.IsActive &&
                r.StartDate < request.EndDate &&
                request.StartDate < r.EndDate);

            if (isOccupied) return false;

            var reservation = new Reservation
            {
                DeskId = request.DeskId,
                UserId = request.UserId,
                UserFullName = request.UserFullName,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = true
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return true;
        }
        // Atsaukimas tiesiog pazymi rezervacija kaip neaktyvia (IsActive = false).
        // Tai geriau nei trynimas, nes islieka istorija statistikai.
        public async Task<bool> CancelReservationAsync(int reservationId)
        {
            var reservation = await _context.Reservations.FindAsync(reservationId);
            if (reservation == null || !reservation.IsActive)
            {
                return false;
            }

            reservation.IsActive = false;
            await _context.SaveChangesAsync();

            return true;
        }

    }
}