using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using System.IO;
using System.Threading.Tasks;

public class PaymentController : ControllerBase
{
    private readonly StripeSettings _stripeSettings;

    public PaymentController(IOptions<StripeSettings> stripeSettings)
    {
        _stripeSettings = stripeSettings.Value;

        // Set the Stripe API Key globally
        StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
    }

    [HttpPost("create-payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] dynamic data)
    {
        Console.WriteLine("Create Payment Intent called");

        try
        {
            var amount = (long)data.amount * 100; // Convert to cents
            Console.WriteLine($"Amount: {amount}");

            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            Console.WriteLine($"PaymentIntent created: {paymentIntent.Id}");
            return Ok(new { clientSecret = paymentIntent.ClientSecret });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

[ApiController]
[Route("api/webhooks/stripe")]
public class StripeWebhookController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public StripeWebhookController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<IActionResult> HandleStripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var webhookSecret = _configuration["Stripe:WebhookSecret"];
        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                webhookSecret
            );
        }
        catch (StripeException ex)
        {
            Console.WriteLine($"Stripe Webhook Error: {ex.Message}");
            return BadRequest($"Webhook Error: {ex.Message}");
        }

        // Handle the event using string values for event types
        switch (stripeEvent.Type)
        {
            case "payment_intent.succeeded": // Use string directly
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                if (paymentIntent != null)
                {
                    Console.WriteLine($"PaymentIntent succeeded: {paymentIntent.Id}");
                    // Add your business logic here
                }
                else
                {
                    Console.WriteLine("PaymentIntent is null or invalid.");
                }
                break;

            case "payment_intent.payment_failed": // Use string directly
                var failedPaymentIntent = stripeEvent.Data.Object as PaymentIntent;
                if (failedPaymentIntent != null)
                {
                    Console.WriteLine($"PaymentIntent failed: {failedPaymentIntent.Id}");
                    // Add your failure handling logic here
                }
                else
                {
                    Console.WriteLine("Failed PaymentIntent is null or invalid.");
                }
                break;

            default:
                Console.WriteLine($"Unhandled event type: {stripeEvent.Type}");
                break;
        }

        return Ok();
    }
}
