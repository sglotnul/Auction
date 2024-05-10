using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_Users_UserId",
                table: "Profiles");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_UserId",
                table: "Profiles");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Profiles",
                newName: "FirstName");

            migrationBuilder.AddColumn<int>(
                name: "ProfileId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Biography",
                table: "Profiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Education",
                table: "Profiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Profiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Sex",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Auctions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Auctions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Auctions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

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
                        name: "FK_AuctionCategory_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                column: "ProfileId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ProfileId",
                table: "Users",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_AuctionCategory_CategoryId",
                table: "AuctionCategory",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Profiles_ProfileId",
                table: "Users",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Profiles_ProfileId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "AuctionCategory");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropIndex(
                name: "IX_Users_ProfileId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ProfileId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Biography",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Education",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Auctions");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Profiles",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_UserId",
                table: "Profiles",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_Users_UserId",
                table: "Profiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
