using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "Role", "SecurityStamp" },
                values: new object[] { "0a9075ae-9405-4834-8013-a1e238d16e8c", "AQAAAAIAAYagAAAAELAES9WAsvCEuXIppkd8aUgS6tSZeYK01hSLbCx/w3W60oR1pcrrcFDMv6BrJLh/3w==", 3, "03fd5963-a3b3-4d37-888d-c6786c2b7fb0" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "Role", "SecurityStamp" },
                values: new object[] { "9c241c03-d0e7-47cb-864b-4f418d0132ea", "AQAAAAIAAYagAAAAEA3O7Iiqi1/KCTZOTTNKTY3JUSIBQJ+4OL0g0HDIU/eszDkMPaRbZSTpvCrVOQzuWw==", 0, "6d2d2038-dfac-4d30-ac30-4cd47900f421" });
        }
    }
}
