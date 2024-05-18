namespace Auction.Model;

public class Category
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;

	public ICollection<Auction> Auctions { get; set; } = new List<Auction>();
}