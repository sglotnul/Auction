using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Auctions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentUserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auctions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Auctions_Users_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Profiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Profiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                        name: "FK_ConsultantBids_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultantBids_Users_ConsultantUserId",
                        column: x => x.ConsultantUserId,
                        principalTable: "Users",
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
                        name: "FK_ConsultationSessions_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultationSessions_Users_ConsultantUserId",
                        column: x => x.ConsultantUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultationSessions_Users_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Role" },
                values: new object[] { "26214742-0a8b-40ea-ab76-ec78aeee3429", 3 });

            migrationBuilder.CreateIndex(
                name: "IX_Auctions_StudentUserId",
                table: "Auctions",
                column: "StudentUserId");

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

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_UserId",
                table: "Profiles",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsultantBids");

            migrationBuilder.DropTable(
                name: "ConsultationSessions");

            migrationBuilder.DropTable(
                name: "Profiles");

            migrationBuilder.DropTable(
                name: "Auctions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
