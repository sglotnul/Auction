using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Migrator.Migrations
{
    /// <inheritdoc />
    public partial class Wip9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Auctions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Consultations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StartAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ConsultantId = table.Column<string>(type: "text", nullable: false),
                    StudentId = table.Column<string>(type: "text", nullable: false),
                    AuctionId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consultations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Consultations_AspNetUsers_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Consultations_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Consultations_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fb35c939-b959-4599-bd5f-df49aff8fc9f", "AQAAAAIAAYagAAAAENhK5BDyYnCS7rGiao+B/cRkoL9seaSBCx0T37V60mi/mSDjwbTjCWcv+2/EX0vUOw==", "7e4dbd8e-5854-4665-b5a2-772953cc57f3" });

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_AuctionId",
                table: "Consultations",
                column: "AuctionId");

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_ConsultantId",
                table: "Consultations",
                column: "ConsultantId");

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_StudentId",
                table: "Consultations",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Consultations");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Auctions");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "26214742-0a8b-40ea-ab76-ec78aeee3429",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "73609ace-3723-4d04-a311-6bc17f98f6bc", "AQAAAAIAAYagAAAAEDhwpMcIojWe62W51s/x/ANTlB+LT6PeOgfWUxV4MlABmvC1StDpHbEfdMW89Zo30w==", "d7e2039f-71cd-4638-8679-95ec118f60e3" });
        }
    }
}
