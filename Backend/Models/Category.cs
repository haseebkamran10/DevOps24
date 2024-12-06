using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Category
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(50)]
    public required string CategoryName { get; set; }

    [Required]
    [MaxLength(200)]
    public required string Description { get; set; }
}