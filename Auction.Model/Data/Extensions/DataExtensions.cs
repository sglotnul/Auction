using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Auction.Model;

public static class DataExtensions
{
    public static async Task AddOrUpdateAsync<TEntity>(
        this AppDbContext context, 
        Func<AppDbContext, DbSet<TEntity>> entitiesProvider,
        Expression<Func<TEntity, bool>> selector, 
        TEntity entity)
        where TEntity : class
    {
        var entities = entitiesProvider.Invoke(context);
        
        var existingEntity = await entities.SingleOrDefaultAsync(selector);
        
        if (existingEntity == null)
        {
            entities.Add(entity);
        }
        else
        {
            entities.Entry(existingEntity).CurrentValues.SetValues(entity);
        }
    
        await context.SaveChangesAsync();
    }
}