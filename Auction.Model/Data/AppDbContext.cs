using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auction.Model;

public class AppDbContext : IdentityDbContext<User>
{
	private const string DefaultUserName = "admin";
	private const string DefaultUserPassword = "admin";
	private const string DefaultUserId = "26214742-0a8b-40ea-ab76-ec78aeee3429";
	
	public DbSet<Profile> Profiles { get; set; } = null!;
	public DbSet<Category> Categories { get; set; } = null!;
	public DbSet<Auction> Auctions { get; set; } = null!;
	public DbSet<Bid> Bids { get; set; } = null!;
	public DbSet<Consultation> Consultations { get; set; } = null!;

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

			entity.Property(e => e.BirthDate)
				.HasColumnType("date");
		});
		
		modelBuilder.Entity<Auction>(entity =>
		{
			entity.HasKey(e => e.Id);
			
			entity.HasOne(e => e.User)
				.WithMany(e => e.Auctions)
				.HasForeignKey(e => e.UserId);
			
			entity.HasMany(s => s.Categories)
				.WithMany()
				.UsingEntity<Dictionary<string, object>>(
					"AuctionCategory",
					j => j.HasOne<Category>().WithMany().HasForeignKey("CategoryId"),
					j => j.HasOne<Auction>().WithMany().HasForeignKey("AuctionId"));
		});
		
		modelBuilder.Entity<Category>(entity =>
		{
			entity.HasKey(e => e.Id);
			
			entity.HasData(CreateInitialCategories());
		});

		modelBuilder.Entity<Bid>(entity =>
		{
			entity.HasKey(e => e.Id);
			
			entity.HasOne(e => e.Auction)
				.WithMany(e => e.Bids)
				.HasForeignKey(e => e.AuctionId);
			
			entity.HasOne(e => e.User)
				.WithMany(e => e.Bids)
				.HasForeignKey(e => e.UserId);
		});

		modelBuilder.Entity<Consultation>(entity =>
		{
			entity.HasKey(e => e.Id);

			entity.HasOne(e => e.Auction)
				.WithMany()
				.HasForeignKey(e => e.AuctionId);
				
			entity.HasOne(e => e.Consultant)
				.WithMany()
				.HasForeignKey(e => e.ConsultantId);
			
			entity.HasOne(e => e.Student)
				.WithMany()
				.HasForeignKey(e => e.StudentId);
		});
	}

	private static User CreateInitialUser()
	{
		var defaultUser = new User
		{ 
			Id = DefaultUserId, 
			UserName = DefaultUserName,
			NormalizedUserName = DefaultUserName.ToUpper(),
			Role = Role.Admin
		};
		defaultUser.PasswordHash = new PasswordHasher<User>().HashPassword(defaultUser, DefaultUserPassword);

		return defaultUser;
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