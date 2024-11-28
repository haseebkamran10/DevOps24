using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;

public class AuctionManagementService : BackgroundService
{
    private readonly IDbContextFactory<DatabaseContext> _dbContextFactory;
    private readonly ILogger<AuctionManagementService> _logger;

    public AuctionManagementService(IDbContextFactory<DatabaseContext> dbContextFactory, ILogger<AuctionManagementService> logger)
    {
        _dbContextFactory = dbContextFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Auction Management Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Create a new DbContext instance for this iteration
                using var dbContext = _dbContextFactory.CreateDbContext();
                var executionStrategy = dbContext.Database.CreateExecutionStrategy();

                await executionStrategy.ExecuteAsync(async () =>
                {
                    // Fetch auctions that need to be closed
                    var auctionsToClose = await dbContext.Auctions
                        .AsNoTracking()
                        .Include(a => a.Bids)
                        .Where(a => !a.IsClosed && a.EndTime <= DateTime.UtcNow)
                        .ToListAsync(stoppingToken);

                    if (!auctionsToClose.Any())
                    {
                        _logger.LogInformation("No auctions to process.");
                        return;
                    }

                    _logger.LogInformation($"Found {auctionsToClose.Count} auctions to process.");

                    // Limit parallelism to avoid resource exhaustion
                    const int maxParallelism = 2;
                    var semaphore = new SemaphoreSlim(maxParallelism);

                    var tasks = auctionsToClose.Select(async auction =>
                    {
                        await semaphore.WaitAsync(stoppingToken);
                        try
                        {
                            await ProcessAuctionAsync(auction, stoppingToken);
                        }
                        finally
                        {
                            semaphore.Release();
                        }
                    });

                    await Task.WhenAll(tasks);

                    _logger.LogInformation("Auction processing completed.");
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while processing auctions: {ex}");
            }

            // Wait for a minute before checking again
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }

        _logger.LogInformation("Auction Management Service is stopping.");
    }

    private async Task ProcessAuctionAsync(Auction auction, CancellationToken stoppingToken)
    {
        // Create a new DbContext instance for processing each auction
        using var dbContext = _dbContextFactory.CreateDbContext();
        using var transaction = await dbContext.Database.BeginTransactionAsync(stoppingToken);

        try
        {
            // Reload auction with tracking
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
                // Close auction with a winner if the bid meets or exceeds the minimum price
                auctionForUpdate.IsClosed = true;
                auctionForUpdate.CurrentBid = winningBid.BidAmount;
                auctionForUpdate.UpdatedAt = DateTime.UtcNow;

                _logger.LogInformation($"Auction {auction.AuctionId} ended successfully. Winner: User {winningBid.UserId}, Amount: {winningBid.BidAmount}");
            }
            else if (DateTime.UtcNow >= auctionForUpdate.StartTime.AddHours((auctionForUpdate.EndTime - auctionForUpdate.StartTime).TotalHours))
            {
                // Close auction without a winner after the specified duration
                auctionForUpdate.IsClosed = true;
                auctionForUpdate.CurrentBid = null;
                auctionForUpdate.UpdatedAt = DateTime.UtcNow;

                _logger.LogInformation($"Auction {auction.AuctionId} ended without a winner.");
            }

            dbContext.Auctions.Update(auctionForUpdate);

            // Commit transaction
            await dbContext.SaveChangesAsync(stoppingToken);
            await transaction.CommitAsync(stoppingToken);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing auction {auction.AuctionId}: {ex}");
            await transaction.RollbackAsync(stoppingToken);
        }
    }
}
