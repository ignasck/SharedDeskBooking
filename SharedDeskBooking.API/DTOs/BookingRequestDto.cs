namespace SharedDeskBooking.API.DTOs
{
    public class BookingRequestDto
    {
        public int DeskId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
