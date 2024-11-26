using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
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
                var executionStrategy = dbContext.Database.CreateExecutionStrategy();

                await executionStrategy.ExecuteAsync(async () =>
                {
                    // Fetch auctions that need to be closed
                    var auctionsToClose = await dbContext.Auctions
                        .Include(a => a.Bids) // Include related bids
                        .Where(a => !a.IsClosed && a.EndTime <= DateTime.UtcNow)
                        .AsNoTracking() // Reduce memory overhead for read-only operations
                        .ToListAsync(stoppingToken);

                    if (!auctionsToClose.Any())
                    {
                        _logger.LogInformation("No auctions to process.");
                        return;
                    }

                    // Process auctions in parallel
                    var tasks = auctionsToClose.Select(async auction =>
                    {
                        try
                        {
                            _logger.LogInformation($"Processing auction {auction.AuctionId}");

                            // Reload the auction entity for updates (needed because of AsNoTracking)
                            var auctionForUpdate = await dbContext.Auctions
                                .Include(a => a.Bids)
                                .FirstAsync(a => a.AuctionId == auction.AuctionId, stoppingToken);

                            // Find the winning bid
                            var winningBid = auctionForUpdate.Bids
                                .Where(b => b.BidAmount >= auction.MinimumPrice)
                                .OrderByDescending(b => b.BidAmount)
                                .FirstOrDefault();

                            if (winningBid != null)
                            {
                                // Update auction as closed and set the winning bid
                                auctionForUpdate.IsClosed = true;
                                auctionForUpdate.CurrentBid = winningBid.BidAmount;
                                auctionForUpdate.UpdatedAt = DateTime.UtcNow;

                                _logger.LogInformation($"Auction {auction.AuctionId} ended. Winner: User {winningBid.UserId}, Amount: {winningBid.BidAmount}");
                            }
                            else
                            {
                                // No valid bids; close the auction without a winner
                                auctionForUpdate.IsClosed = true;
                                auctionForUpdate.CurrentBid = null;
                                auctionForUpdate.UpdatedAt = DateTime.UtcNow;

                                _logger.LogInformation($"Auction {auction.AuctionId} ended with no winners.");
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"Error processing auction {auction.AuctionId}: {ex.Message}");
                        }
                    });

                    await Task.WhenAll(tasks);

                    // Save all changes in a single transaction
                    await dbContext.SaveChangesAsync(stoppingToken);
                });
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
