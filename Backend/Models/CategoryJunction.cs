using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CategoryJunction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [ForeignKey("ItemId")]
    public int ItemId { get; set; }

    [Required]
    [ForeignKey("CategoryId")]
    public int CategoryId { get; set; }
}