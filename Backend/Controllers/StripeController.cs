using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Backend.DTOs;


namespace Backend.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly StripeSettings _stripeSettings;

        public PaymentController(IOptions<StripeSettings> stripeSettings)
        {
            _stripeSettings = stripeSettings.Value;
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
        }

        /// <summary>
        /// Creates a PaymentIntent to initiate a payment session.
        /// </summary>
        /// <param name="request">The PaymentIntentRequest containing the amount.</param>
        /// <returns>A response containing the client secret of the PaymentIntent.</returns>
        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequest request)
        {
            Console.WriteLine("Create Payment Intent called");

            try
            {
                var amountInCents = request.Amount * 100; 
                Console.WriteLine($"Amount: {amountInCents}");

                var options = new PaymentIntentCreateOptions
                {
                    Amount = amountInCents,
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
            return BadRequest(new { error = $"Webhook Error: {ex.Message}" });
        }


        switch (stripeEvent.Type)
        {
            case "payment_intent.succeeded":
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                if (paymentIntent != null)
                {
                    Console.WriteLine($"PaymentIntent succeeded: {paymentIntent.Id}");

                }
                break;

            case "payment_intent.payment_failed":
                var failedPaymentIntent = stripeEvent.Data.Object as PaymentIntent;
                if (failedPaymentIntent != null)
                {
                    Console.WriteLine($"PaymentIntent failed: {failedPaymentIntent.Id}");

                }
                break;

            case "payment_intent.requires_action":
                var requiresActionIntent = stripeEvent.Data.Object as PaymentIntent;
                if (requiresActionIntent != null)
                {
                    Console.WriteLine($"Payment requires action: {requiresActionIntent.Id}");
                 
                }
                break;

            default:
                Console.WriteLine($"Unhandled event type: {stripeEvent.Type}");
                break;
        }

        return Ok();
    }
}

}
