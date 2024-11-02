using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Bid
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int BidId { get; set; }

    [Required] // Ensures non-null value in the database
    [ForeignKey("ItemId")]
    public required string ItemId { get; set; } // Ensures value is set during object initialization

    [Required]
    [ForeignKey("CustomerId")]
    public int BidderId { get; set; }

    [Required]
    public int BidAmmount { get; set; }

    [Required]
    public DateTime BidTime { get; set; }
}