using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

public class AuctionManagementService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AuctionManagementService> _logger;

    public AuctionManagementService(IServiceProvider serviceProvider, ILogger<AuctionManagementService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Auction Management Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

                // Fetch auctions that need to be closed
                var auctionsToClose = await dbContext.Auctions
                    .Include(a => a.Bids) // Include related bids
                    .Where(a => !a.IsClosed && a.EndTime <= DateTime.UtcNow)
                    .ToListAsync(stoppingToken);

                foreach (var auction in auctionsToClose)
                {
                    _logger.LogInformation($"Processing auction {auction.AuctionId}");

                    // Find the winning bid
                    var winningBid = auction.Bids
                        .Where(b => b.BidAmount >= auction.MinimumPrice)
                        .OrderByDescending(b => b.BidAmount)
                        .FirstOrDefault();

                    if (winningBid != null)
                    {
                        // Update auction as closed and set the winning bid
                        auction.IsClosed = true;
                        auction.CurrentBid = winningBid.BidAmount;
                        auction.UpdatedAt = DateTime.UtcNow;

                        _logger.LogInformation($"Auction {auction.AuctionId} ended. Winner: User {winningBid.UserId}, Amount: {winningBid.BidAmount}");
                    }
                    else
                    {
                        // No valid bids; close the auction without a winner
                        auction.IsClosed = true;
                        auction.CurrentBid = null;
                        auction.UpdatedAt = DateTime.UtcNow;

                        _logger.LogInformation($"Auction {auction.AuctionId} ended with no winners.");
                    }

                    // Save changes to the database
                    await dbContext.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while processing auctions: {ex.Message}");
            }

            // Wait for a minute before checking again
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }

        _logger.LogInformation("Auction Management Service is stopping.");
    }
}
