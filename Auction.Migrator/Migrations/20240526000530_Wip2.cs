using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Profiles",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "dfeca20a-5155-4e99-a134-f037f3ba13f2", "AQAAAAIAAYagAAAAEO7yoO7xeQ0PxmyRVmoFpk33hITNeCGbGhQHtSc7nU8MabpCh9DoeHxajb1zRJaVeA==", "62584c32-dcea-4812-8645-ff38e1a2a701" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Profiles");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "f72c7a24-b1e2-4336-8b86-ce3db2d2be67", "AQAAAAIAAYagAAAAEAOmUqwdMCrX0kB5pKfm0GHrgR6h20DAxFDaei5PDos/JaZOpDzonKGriN8RpYSayg==", "fb897f31-3b0b-4886-a798-6b057aa9dde2" });
        }
    }
}
