using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuctionCategories");

            migrationBuilder.CreateTable(
                name: "AuctionCategory",
                columns: table => new
                {
                    AuctionId = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuctionCategory", x => new { x.AuctionId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_AuctionCategory_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AuctionCategory_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
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
                name: "IX_AuctionCategory_CategoryId",
                table: "AuctionCategory",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuctionCategory");

            migrationBuilder.CreateTable(
                name: "AuctionCategories",
                columns: table => new
                {
                    AuctionId = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuctionCategories", x => new { x.AuctionId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_AuctionCategories_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AuctionCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "0a9075ae-9405-4834-8013-a1e238d16e8c", "AQAAAAIAAYagAAAAELAES9WAsvCEuXIppkd8aUgS6tSZeYK01hSLbCx/w3W60oR1pcrrcFDMv6BrJLh/3w==", "03fd5963-a3b3-4d37-888d-c6786c2b7fb0" });

            migrationBuilder.CreateIndex(
                name: "IX_AuctionCategories_CategoryId",
                table: "AuctionCategories",
                column: "CategoryId");
        }
    }
}
