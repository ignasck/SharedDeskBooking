namespace SharedDeskBooking.API.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int DeskId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        
        public Desk? Desk { get; set; }
    }
}
