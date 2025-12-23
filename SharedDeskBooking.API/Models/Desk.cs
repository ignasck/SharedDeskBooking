namespace SharedDeskBooking.API.Models
{
    public class Desk
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public bool IsUnderMaintenance { get; set; }
        public string? MaintenanceInfo { get; set; }
    }
}
