using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum AccountType
{
    Buyer,
    Seller,
    Both
}

public class Customer
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CustomerId { get; set; }

    [Required]
    [MaxLength(50)]
    public required string FirstName { get; set; }

    [Required] // Ensures non-null value in the database
    [MaxLength(50)]
    public required string LastName { get; set; } // Ensures value is set during object initialization

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public required string Email { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Password { get; set; }

    [MaxLength(200)]
    public required string Address { get; set; }

    [Phone]
    [MaxLength(15)]
    public required string PhoneNumber { get; set; }

    [Required]
    public AccountType AccountType { get; set; }

    public DateTime RegistrationDate { get; set; }
}