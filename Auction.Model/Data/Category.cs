namespace Auction.Model;

public class Category
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;

	public IList<Auction> Auctions { get; set; } = null!;
}