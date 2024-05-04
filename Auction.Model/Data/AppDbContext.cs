using Microsoft.EntityFrameworkCore;

namespace Auction.Model;

public class AppDbContext : DbContext
{
	private const string DefaultUserId = "26214742-0a8b-40ea-ab76-ec78aeee3429";
	
	public DbSet<User> Users { get; set; }
	public DbSet<Profile> Profiles { get; set; }
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
		
		modelBuilder.Entity<Profile>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.User)
				.WithOne()
				.HasForeignKey<Profile>(e => e.UserId);

			entity.HasIndex(e => e.UserId)
				.IsUnique();
		});
		
		modelBuilder.Entity<Auction>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.StudentUser)
				.WithMany()
				.HasForeignKey(e => e.StudentUserId);
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

		modelBuilder.Entity<User>(entity =>
		{
			entity.HasData(new User
			{
				Id = DefaultUserId,
				Role = Role.Admin
			});
		});
	}
}