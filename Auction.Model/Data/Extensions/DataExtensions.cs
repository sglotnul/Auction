using System.Data;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Auction.Model;

public static class DataExtensions
{
    public static async Task<TEntity> AddOrUpdateAsync<TEntity>(
        this AppDbContext context, 
        Func<AppDbContext, DbSet<TEntity>> entitiesProvider,
        Expression<Func<TEntity, bool>> selector, 
        TEntity entity)
        where TEntity : class
    {
        var entities = entitiesProvider.Invoke(context);

        await using var transaction = await context.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        try
        {
            var existingEntity = await entities.SingleOrDefaultAsync(selector);

            if (existingEntity == null)
            {
                entities.Add(entity);
            }
            else
            {
                var keyName = context.Model.FindEntityType(typeof(TEntity))!
                    .FindPrimaryKey()!
                    .Properties
                    .Select(p => p.Name)
                    .ToList();

                var entry = context.Entry(existingEntity);
                var entityEntry = context.Entry(entity);

                foreach (var property in entry.Properties)
                {
                    if (!keyName.Contains(property.Metadata.Name))
                    {
                        property.CurrentValue = entityEntry.Property(property.Metadata.Name).CurrentValue;
                    }
                }
            }

            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return existingEntity ?? entity;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}