using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MinIncrease",
                table: "Auctions",
                newName: "MinDecrease");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "58b74934-40ae-4e18-b27b-3e87a15edd1a", "AQAAAAIAAYagAAAAEF5vaziYIJ2LMgWqua1FqktGcOEhSn2A7o8FyMz7gvWn5CxJ2HUOXolV2A9/Ns227Q==", "1b2ed0d2-09e0-42b4-a460-9226c33782bf" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MinDecrease",
                table: "Auctions",
                newName: "MinIncrease");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a5d2d08a-6717-4fc6-8255-5a19c26dd0c2", "AQAAAAIAAYagAAAAEAxjnv8pMOtpogNsZzSmEXevMUEPsgDYh/ajk5kKQ/8raMFu5A/ocQHr4g+oMWvR1g==", "553ef106-12ff-44fc-96c7-815d36cf4744" });
        }
    }
}
