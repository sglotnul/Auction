using Auction.Services;

CreateHostBuilder(args).Build().Run();
return;

static IHostBuilder CreateHostBuilder(string[] args)
{
    return Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseWebRoot("static");
            webBuilder.UseStartup<Startup>();
        });
}