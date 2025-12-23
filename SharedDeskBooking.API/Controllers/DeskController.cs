using Microsoft.AspNetCore.Mvc;
using SharedDeskBooking.API.Services;
using SharedDeskBooking.API.DTOs;

namespace SharedDeskBooking.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DeskController : ControllerBase
{
    private readonly IDeskService _deskService;

    public DeskController(IDeskService deskService)
    {
        _deskService = deskService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeskDto>>> GetDesks()
    {
        var desks = await _deskService.GetDesksAsync();
        return Ok(desks);
    }

    [HttpPost("book")]
    public async Task<ActionResult> BookDesk([FromBody] BookingRequestDto request)
    {
        var result = await _deskService.BookDeskAsync(request);
        if (!result)
        {
            return BadRequest("Rezervacijos negalima užsakyti (stalas užimtas arba remontuojamas).");
        }
        return Ok(new { message = "Stalas sėkmingai rezervuotas!" });
    }

    [HttpPost("cancel")]
    public async Task<ActionResult> CancelReservation([FromBody] int reservationId)
    {
        var result = await _deskService.CancelReservationAsync(reservationId);
        if (!result)
        {
            return BadRequest("Negalima atšaukti rezervacijos.");
        }
        return Ok(new { message = "Rezervacija sėkmingai atšaukta!" });
    }
}
