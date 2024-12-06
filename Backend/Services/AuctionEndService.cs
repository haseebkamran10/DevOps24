
using Microsoft.EntityFrameworkCore;
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
             
                using var dbContext = _dbContextFactory.CreateDbContext();
                var executionStrategy = dbContext.Database.CreateExecutionStrategy();

                await executionStrategy.ExecuteAsync(async () =>
                {
                 
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

            
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }

        _logger.LogInformation("Auction Management Service is stopping.");
    }

    private async Task ProcessAuctionAsync(Auction auction, CancellationToken stoppingToken)
    {
        
        using var dbContext = _dbContextFactory.CreateDbContext();
        using var transaction = await dbContext.Database.BeginTransactionAsync(stoppingToken);

        try
        {
           
            var auctionForUpdate = await dbContext.Auctions
                .Include(a => a.Bids)
                .FirstAsync(a => a.AuctionId == auction.AuctionId, stoppingToken);

           
            var winningBid = auctionForUpdate.Bids
                .Where(b => b.BidAmount >= auction.MinimumPrice)
                .OrderByDescending(b => b.BidAmount)
                .FirstOrDefault();

            if (winningBid != null)
            {
                
                auctionForUpdate.IsClosed = true;
                auctionForUpdate.CurrentBid = winningBid.BidAmount;
                auctionForUpdate.UpdatedAt = DateTime.UtcNow;

                _logger.LogInformation($"Auction {auction.AuctionId} ended successfully. Winner: User {winningBid.UserId}, Amount: {winningBid.BidAmount}");
            }
            else if (DateTime.UtcNow >= auctionForUpdate.StartTime.AddHours((auctionForUpdate.EndTime - auctionForUpdate.StartTime).TotalHours))
            {
                
                auctionForUpdate.IsClosed = true;
                auctionForUpdate.CurrentBid = null;
                auctionForUpdate.UpdatedAt = DateTime.UtcNow;

                _logger.LogInformation($"Auction {auction.AuctionId} ended without a winner.");
            }

            dbContext.Auctions.Update(auctionForUpdate);

    
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
