using Microsoft.EntityFrameworkCore;

namespace Auction.Model;

public class AppDbContext : DbContext
{
	private const string DefaultUserId = "26214742-0a8b-40ea-ab76-ec78aeee3429";
	
	public DbSet<User> Users { get; set; }
	public DbSet<Profile> Profiles { get; set; }
	public DbSet<Category> Categories { get; set; }
	public DbSet<AuctionCategory> AuctionCategories { get; set; }
	public DbSet<Auction> Auctions { get; set; }
	public DbSet<ConsultantBid> ConsultantBids { get; set; }
	public DbSet<ConsultationSession> ConsultationSessions { get; set; }
	
	public AppDbContext(DbContextOptions<AppDbContext> options)
		: base(options)
	{
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);
		
		modelBuilder.Entity<User>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.Profile)
				.WithMany()
				.HasForeignKey(e => e.ProfileId);
			
			entity.HasData(CreateInitialUser());
		});
		
		modelBuilder.Entity<Profile>(entity =>
		{
			entity.HasKey(e => e.Id);
		});
		
		modelBuilder.Entity<Auction>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.StudentUser)
				.WithMany()
				.HasForeignKey(e => e.StudentUserId);
		});
		
		modelBuilder.Entity<Category>(entity =>
		{
			entity.HasKey(e => e.Id);
			
			entity.HasData(CreateInitialCategories());
		});
		
		modelBuilder.Entity<AuctionCategory>(entity =>
		{
			entity.HasKey(e => new { e.AuctionId, e.CategoryId });
			entity.HasOne(e => e.Category)
				.WithMany()
				.HasForeignKey(e => e.CategoryId);
			entity.HasOne(e => e.Auction)
				.WithMany()
				.HasForeignKey(e => e.AuctionId);
		});
		
		modelBuilder.Entity<ConsultantBid>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.Auction)
				.WithMany()
				.HasForeignKey(e => e.AuctionId);
			entity.HasOne(e => e.ConsultantUser)
				.WithMany()
				.HasForeignKey(e => e.ConsultantUserId);
		});
		
		modelBuilder.Entity<ConsultationSession>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.Auction)
				.WithMany()
				.HasForeignKey(e => e.AuctionId);
			entity.HasOne(e => e.ConsultantUser)
				.WithMany()
				.HasForeignKey(e => e.ConsultantUserId);
			entity.HasOne(e => e.StudentUser)
				.WithMany()
				.HasForeignKey(e => e.StudentUserId);
		});
	}

	private static User CreateInitialUser()
	{
		return new User
		{
			Id = DefaultUserId,
			Role = Role.Admin
		};
	}
	
	private static IEnumerable<Category> CreateInitialCategories()
	{
		yield return new Category
		{
			Id = 1,
			Name = "Math"
		};

		yield return new Category
		{
			Id = 2,
			Name = "Economy"
		};

		yield return new Category
		{
			Id = 3,
			Name = "Chemistry"
		};
	}
}