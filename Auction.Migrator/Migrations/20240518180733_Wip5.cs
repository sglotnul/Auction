using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Auctions_AspNetUsers_StudentUserId",
                table: "Auctions");

            migrationBuilder.DropTable(
                name: "ConsultantBids");

            migrationBuilder.DropTable(
                name: "ConsultationSessions");

            migrationBuilder.RenameColumn(
                name: "StudentUserId",
                table: "Auctions",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Auctions",
                newName: "Title");

            migrationBuilder.RenameIndex(
                name: "IX_Auctions_StudentUserId",
                table: "Auctions",
                newName: "IX_Auctions_UserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndAt",
                table: "Auctions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "InitialPrice",
                table: "Auctions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MinIncrease",
                table: "Auctions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartAt",
                table: "Auctions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Bids",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: false),
                    AuctionId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bids", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bids_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bids_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e56d5034-a495-45ac-9f5a-e493c3226a0c", "AQAAAAIAAYagAAAAENK4HhvYgRAnkbzErE0lobdKBLd00jlsZkP+cpN3TlEtwado0bvsWi4FEjqpb6dkOw==", "c523553b-ebd9-4189-ac5e-e9031cada489" });

            migrationBuilder.CreateIndex(
                name: "IX_Bids_AuctionId",
                table: "Bids",
                column: "AuctionId");

            migrationBuilder.CreateIndex(
                name: "IX_Bids_UserId",
                table: "Bids",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Auctions_AspNetUsers_UserId",
                table: "Auctions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Auctions_AspNetUsers_UserId",
                table: "Auctions");

            migrationBuilder.DropTable(
                name: "Bids");

            migrationBuilder.DropColumn(
                name: "EndAt",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "InitialPrice",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "MinIncrease",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "StartAt",
                table: "Auctions");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Auctions",
                newName: "StudentUserId");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Auctions",
                newName: "Name");

            migrationBuilder.RenameIndex(
                name: "IX_Auctions_UserId",
                table: "Auctions",
                newName: "IX_Auctions_StudentUserId");

            migrationBuilder.CreateTable(
                name: "ConsultantBids",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AuctionId = table.Column<int>(type: "integer", nullable: false),
                    ConsultantUserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsultantBids", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsultantBids_AspNetUsers_ConsultantUserId",
                        column: x => x.ConsultantUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultantBids_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConsultationSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AuctionId = table.Column<int>(type: "integer", nullable: false),
                    ConsultantUserId = table.Column<string>(type: "text", nullable: false),
                    StudentUserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsultationSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsultationSessions_AspNetUsers_ConsultantUserId",
                        column: x => x.ConsultantUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultationSessions_AspNetUsers_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultationSessions_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4ca4b5da-9bfe-48f9-b0fc-a06d96a7b11c", "AQAAAAIAAYagAAAAEHJVssSyjH/5TQndQUhaUl1vk/SIlS1A/ZI+JaCNkAEBPvGvGUPphLaR4d6ccB2VrA==", "2bdeb654-1f6e-41cf-b5a0-f14cec60152a" });

            migrationBuilder.CreateIndex(
                name: "IX_ConsultantBids_AuctionId",
                table: "ConsultantBids",
                column: "AuctionId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultantBids_ConsultantUserId",
                table: "ConsultantBids",
                column: "ConsultantUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationSessions_AuctionId",
                table: "ConsultationSessions",
                column: "AuctionId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationSessions_ConsultantUserId",
                table: "ConsultationSessions",
                column: "ConsultantUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationSessions_StudentUserId",
                table: "ConsultationSessions",
                column: "StudentUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Auctions_AspNetUsers_StudentUserId",
                table: "Auctions",
                column: "StudentUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
