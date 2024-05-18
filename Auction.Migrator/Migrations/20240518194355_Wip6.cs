using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Comment",
                table: "Bids",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a5d2d08a-6717-4fc6-8255-5a19c26dd0c2", "AQAAAAIAAYagAAAAEAxjnv8pMOtpogNsZzSmEXevMUEPsgDYh/ajk5kKQ/8raMFu5A/ocQHr4g+oMWvR1g==", "553ef106-12ff-44fc-96c7-815d36cf4744" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Comment",
                table: "Bids",
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
                values: new object[] { "e56d5034-a495-45ac-9f5a-e493c3226a0c", "AQAAAAIAAYagAAAAENK4HhvYgRAnkbzErE0lobdKBLd00jlsZkP+cpN3TlEtwado0bvsWi4FEjqpb6dkOw==", "c523553b-ebd9-4189-ac5e-e9031cada489" });
        }
    }
}
