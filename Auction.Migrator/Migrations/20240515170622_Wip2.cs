using System;
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
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Profiles");

            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDate",
                table: "Profiles",
                type: "date",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9c241c03-d0e7-47cb-864b-4f418d0132ea", "AQAAAAIAAYagAAAAEA3O7Iiqi1/KCTZOTTNKTY3JUSIBQJ+4OL0g0HDIU/eszDkMPaRbZSTpvCrVOQzuWw==", "6d2d2038-dfac-4d30-ac30-4cd47900f421" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthDate",
                table: "Profiles");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Gender",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e9d7b177-03b0-4792-bae8-4577008153d5", "AQAAAAIAAYagAAAAEAD+2atck1slOaAXaus/5uOecFiTmIaNAafU8y+KNal3QPkkj8O9lip4uJA4JjBVvg==", "745c3f39-99e2-4e18-ac2f-97b3e010c8d2" });
        }
    }
}
