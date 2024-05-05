using Microsoft.EntityFrameworkCore;
using System;

namespace OnlineAuctionPlatform
{
    public class OnlineAuctionContext : DbContext
    {
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<ConsultantBid> ConsultantBids { get; set; }
        public DbSet<ConsultationSession> ConsultationSessions { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Specify the connection string (or it could be set in the Startup.cs for ASP.NET Core projects)
            optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=OnlineAuctionDb;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Profile entity
            modelBuilder.Entity<Profile>(entity =>
            {
                entity.HasKey(e => e.ProfileID);
                entity.HasOne(e => e.User)
                      .WithOne()
                      .HasForeignKey<Profile>(e => e.UserID);
                // Additional properties configuration
            });

            // Auction entity
            modelBuilder.Entity<Auction>(entity =>
            {
                entity.HasKey(e => e.AuctionID);
                entity.HasOne(e => e.StudentUser)
                      .WithMany()
                      .HasForeignKey(e => e.StudentUserID);
                // Additional properties configuration
            });

            // ConsultantBid entity
            modelBuilder.Entity<ConsultantBid>(entity =>
            {
                entity.HasKey(e => e.BidID);
                entity.HasOne(e => e.Auction)
                      .WithMany()
                      .HasForeignKey(e => e.AuctionID);
                entity.HasOne(e => e.ConsultantUser)
                      .WithMany()
                      .HasForeignKey(e => e.ConsultantUserID);
                // Additional properties configuration
            });

            // ConsultationSession entity
            modelBuilder.Entity<ConsultationSession>(entity =>
            {
                entity.HasKey(e => e.SessionID);
                entity.HasOne(e => e.Auction)
                      .WithMany()
                      .HasForeignKey(e => e.AuctionID);
                entity.HasOne(e => e.ConsultantUser)
                      .WithMany()
                      .HasForeignKey(e => e.ConsultantUserID);
                entity.HasOne(e => e.StudentUser)
                      .WithMany()
                      .HasForeignKey(e => e.StudentUserID);
                // Additional properties configuration
            });

            // Review entity
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.ReviewID);
                entity.HasOne(e => e.ConsultationSession)
                      .WithMany()
                      .HasForeignKey(e => e.SessionID);
                entity.HasOne(e => e.StudentUser)
                      .WithMany()
                      .HasForeignKey(e => e.StudentUserID);
                entity.HasOne(e => e.ConsultantUser)
                      .WithMany()
                      .HasForeignKey(e => e.ConsultantUserID);
                // Additional properties configuration
            });

            // Notification entity
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.NotificationID);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserID);
                // Additional properties configuration
            });

            // Message entity
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.MessageID);
                entity.HasOne(e => e.SenderUser)
                      .WithMany()
                      .HasForeignKey(e => e.SenderUserID);
                entity.HasOne(e => e.ReceiverUser)
                      .WithMany()
                      .HasForeignKey(e => e.ReceiverUserID);
                // Additional properties configuration
            });

            base.OnModelCreating(modelBuilder);
        }
    }

    // Entity classes (simplified for brevity)
    public class Profile
    {
        public int ProfileID { get; set; }
        // Assume UserID is a property within the User entity in the separate authentication application
        public int UserID { get; set; }
        // Other properties...
        public User User { get; set; }
    }

    public class Auction
    {
        public int AuctionID { get; set; }
        public int StudentUserID { get; set; }
        // Other properties...
        public User StudentUser { get; set; }
    }

    public class ConsultantBid
    {
        public int BidID { get; set; }
        public int AuctionID { get; set; }
        public int ConsultantUserID { get; set; }
        // Other properties...
        public Auction Auction { get; set; }
        public User ConsultantUser { get; set; }
    }

    public class ConsultationSession
    {
        public int SessionID { get; set; }
        public int AuctionID { get; set; }
        public int ConsultantUserID { get; set; }
        public int StudentUserID { get; set; }
        // Other properties...
        public Auction Auction { get; set; }
        public User ConsultantUser { get; set; }
        public User StudentUser { get; set; }
    }

    public class Review
    {
        public int ReviewID { get; set; }
        public int SessionID { get; set; }
        public int StudentUserID { get; set; }
        public int ConsultantUserID { get; set; }
        // Other properties...
        public ConsultationSession ConsultationSession { get; set; }
        public User StudentUser { get; set; }
        public User ConsultantUser { get; set; }
    }

    public class Notification
    {
        public int NotificationID { get; set; }
        public int UserID { get; set; }
        // Other properties...
        public User User { get; set; }
    }

    public class Message
    {
        public int MessageID { get; set; }
        public int SenderUserID { get; set; }
        public int ReceiverUserID { get; set; }
        // Other properties...
        public User SenderUser { get; set; }
        public User ReceiverUser { get; set; }
    }

    // User class should be defined within the separate authentication application
    public class User
    {
        public int UserID { get; set; }
        // Other properties like Username, PasswordHash, Email, Role, etc.
    }
}
