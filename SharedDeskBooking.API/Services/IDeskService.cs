using SharedDeskBooking.API.DTOs;

namespace SharedDeskBooking.API.Services
{
    public interface IDeskService
    {
        // Returns a list of desks with their current status
        Task<IEnumerable<DeskDto>> GetDesksAsync();
        Task<bool> BookDeskAsync(BookingRequestDto request);
        Task<bool> CancelReservationAsync(int reservationId);
    }
}
