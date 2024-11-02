using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Transaction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int TransactionId { get; set; }

    [Required]
    [ForeignKey("ItemId")]
    public int ItemId { get; set; }

    [Required]
    [ForeignKey("CustomerId")]
    public int SellerId { get; set; }

    [Required]
    [ForeignKey("CustomerId")]
    public int BuyerId { get; set; }

    [Required]
    public int FinalPrice { get; set; }

    [Required]
    public DateTime TransactionDate { get; set; }
}