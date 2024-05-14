using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sex",
                table: "Profiles",
                newName: "Gender");

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "Profiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e9d7b177-03b0-4792-bae8-4577008153d5", "AQAAAAIAAYagAAAAEAD+2atck1slOaAXaus/5uOecFiTmIaNAafU8y+KNal3QPkkj8O9lip4uJA4JjBVvg==", "745c3f39-99e2-4e18-ac2f-97b3e010c8d2" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Profiles",
                newName: "Sex");

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2211c2ad-7453-4f94-9b4a-3fdca5686f32", "AQAAAAIAAYagAAAAEOoRsA1iWgs3JMRnOf4BxMH9oYIAp4KCFPPHVUJ9+rsL8Y9MwYMXVng61fMuTc56EA==", "e1379f28-1af0-4fdd-b155-069077e1facd" });
        }
    }
}
