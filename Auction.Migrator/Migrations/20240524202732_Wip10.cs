using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BidId",
                table: "Consultations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ca66d41b-f561-4afb-8b66-8a2cf835521d", "AQAAAAIAAYagAAAAEGDTRihc8tIiyBA+aZlYSacHLxFNPwkZZP2kaIDXRMGkAj1luWUynqJTcIJtX+3oDA==", "5af680a0-6b65-4853-a42a-01b77141215c" });

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_BidId",
                table: "Consultations",
                column: "BidId");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Bids_BidId",
                table: "Consultations",
                column: "BidId",
                principalTable: "Bids",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Bids_BidId",
                table: "Consultations");

            migrationBuilder.DropIndex(
                name: "IX_Consultations_BidId",
                table: "Consultations");

            migrationBuilder.DropColumn(
                name: "BidId",
                table: "Consultations");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fb35c939-b959-4599-bd5f-df49aff8fc9f", "AQAAAAIAAYagAAAAENhK5BDyYnCS7rGiao+B/cRkoL9seaSBCx0T37V60mi/mSDjwbTjCWcv+2/EX0vUOw==", "7e4dbd8e-5854-4665-b5a2-772953cc57f3" });
        }
    }
}
