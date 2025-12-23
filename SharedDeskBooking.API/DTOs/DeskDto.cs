namespace SharedDeskBooking.API.DTOs
{
    public enum DeskStatus
    {
        Open,
        Reserved,
        Maintenance
    }

    public class DeskDto
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public DeskStatus Status { get; set; } // open, reserved, maintenance
        public string? ReservedBy { get; set; }
        public string? ReservedById { get; set; }
        public DateTime? ReservationStart { get; set; }
        public DateTime? ReservationEnd { get; set; }
        public string? MaintenanceInfo { get; set; }
        public int? CurrentReservationId { get; set; }
    }
}
