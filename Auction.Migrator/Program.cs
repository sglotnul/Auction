using Auction.Authentication;

using Microsoft.EntityFrameworkCore;

var dbContext = new ApplicationContextFactory().CreateDbContext(args);
dbContext.Database.Migrate();