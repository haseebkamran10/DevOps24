using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuctionsController : ControllerBase
{
    private readonly DatabaseContext _context;

    public AuctionsController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAuction([FromBody] AuctionWare auctionware)
    {
        _context.AuctionWare.Add(auctionware);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAuction), new { id = auctionware.ItemId }, auctionware);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAuction(int id)
    {
        var auction = await _context.AuctionWare.FindAsync(id);
        if (auction == null)
        {
            return NotFound();
        }
        return Ok(auction);
    }

    [HttpGet]
    public async Task<IActionResult> GetAuctions()
    {
        var currentDateTime = DateTime.UtcNow;              //aware of timezones and conversion when people submit auctions
        var auctions = await _context.AuctionWare
                                     .Where(a => a.AuctionEnd > currentDateTime) // Filter out old auctions
                                     .OrderBy(a => a.AuctionEnd) // Order by EndDate in ascending order
                                     .ToListAsync();
        return Ok(auctions);
    }

}