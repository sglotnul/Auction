using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuctionCategory_Auctions_AuctionId",
                table: "AuctionCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_AuctionCategory_Category_CategoryId",
                table: "AuctionCategory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Category",
                table: "Category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AuctionCategory",
                table: "AuctionCategory");

            migrationBuilder.RenameTable(
                name: "Category",
                newName: "Categories");

            migrationBuilder.RenameTable(
                name: "AuctionCategory",
                newName: "AuctionCategories");

            migrationBuilder.RenameIndex(
                name: "IX_AuctionCategory_CategoryId",
                table: "AuctionCategories",
                newName: "IX_AuctionCategories_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AuctionCategories",
                table: "AuctionCategories",
                columns: new[] { "AuctionId", "CategoryId" });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Math" },
                    { 2, "Economy" },
                    { 3, "Chemistry" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionCategories_Auctions_AuctionId",
                table: "AuctionCategories",
                column: "AuctionId",
                principalTable: "Auctions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionCategories_Categories_CategoryId",
                table: "AuctionCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuctionCategories_Auctions_AuctionId",
                table: "AuctionCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_AuctionCategories_Categories_CategoryId",
                table: "AuctionCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AuctionCategories",
                table: "AuctionCategories");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.RenameTable(
                name: "Categories",
                newName: "Category");

            migrationBuilder.RenameTable(
                name: "AuctionCategories",
                newName: "AuctionCategory");

            migrationBuilder.RenameIndex(
                name: "IX_AuctionCategories_CategoryId",
                table: "AuctionCategory",
                newName: "IX_AuctionCategory_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Category",
                table: "Category",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AuctionCategory",
                table: "AuctionCategory",
                columns: new[] { "AuctionId", "CategoryId" });

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionCategory_Auctions_AuctionId",
                table: "AuctionCategory",
                column: "AuctionId",
                principalTable: "Auctions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionCategory_Category_CategoryId",
                table: "AuctionCategory",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
