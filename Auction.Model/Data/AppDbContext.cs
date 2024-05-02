using Microsoft.EntityFrameworkCore;

namespace Auction.Model;

public class AppDbContext : DbContext
{
	public DbSet<Profile> Profiles { get; set; }
	public DbSet<Auction> Auctions { get; set; }
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
				.HasForeignKey<Profile>(e => e.UserID);
		});
		
		modelBuilder.Entity<Auction>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.StudentUser)
				.WithMany()
				.HasForeignKey(e => e.StudentUserID);
		});
		
		modelBuilder.Entity<ConsultationSession>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasOne(e => e.Auction)
				.WithMany()
				.HasForeignKey(e => e.AuctionID);
			entity.HasOne(e => e.ConsultantUser)
				.WithMany()
				.HasForeignKey(e => e.ConsultantUserID);
			entity.HasOne(e => e.StudentUser)
				.WithMany()
				.HasForeignKey(e => e.StudentUserID);
		});
	}
}