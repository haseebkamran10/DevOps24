import React, { useState } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/ui/spinner';

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51Oiyy5FgRV0MG2KqZIHLI7vbTuqEAeVPLwgiUXd7gFdGZyUHhjtXAY7pmEcMbTPuinNQCPAuwOTAKxKY8Xp1N6NU00cASQWq8g");

interface PaymentPageProps {
  totalAmount: number;
  itemTitle: string;
}

const StripePaymentPage: React.FC<PaymentPageProps> = ({ totalAmount, itemTitle }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  });

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>('stripe');
  const [loading, setLoading] = useState(false);

  const handleDeliveryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails({ ...deliveryDetails, [name]: value });
  };

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      setPaymentStatus('Stripe is not loaded. Please try again later.');
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentStatus('Payment failed: Card information is missing.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Call your backend to create the PaymentIntent
      const response = await fetch('https://localhost:5001/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }), // Ensure totalAmount is a number
      });
  
      if (!response.ok) {
        const errorDetails = await response.text(); // Read error details from backend
        throw new Error(`Failed to create payment intent: ${errorDetails}`);
      }
  
      const { clientSecret } = await response.json(); // Get the clientSecret from backend
  
      // Confirm the PaymentIntent on the frontend with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: deliveryDetails.name,
            email: 'customer@example.com', // Optional: Replace with dynamic data
          },
        },
      });
  
      if (result.error) {
        setPaymentStatus(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentStatus('Payment successful!');
        // Redirect to a confirmation page after a short delay
        //setTimeout(() => navigate('/confirmation'), 2000);
      }
    } catch (error: any) {
      setPaymentStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 lg:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Delivery Section */}
        <div className="w-full lg:w-2/3 bg-white p-8 rounded-lg shadow-lg text-black">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Delivery Information</h3>
          <div className="space-y-4 text-left">
            <input
              type="text"
              name="name"
              value={deliveryDetails.name}
              onChange={handleDeliveryInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Full Name"
            />
            {/* Add other delivery fields */}
          </div>
        </div>

        {/* Payment Section */}
        <div className="w-full lg:w-1/3 bg-white p-8 rounded-lg shadow-lg text-black">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Cart</h3>
          <p className="text-gray-600">Product: <span className="font-medium">{itemTitle}</span></p>
          <p className="text-gray-600">Total: <span className="font-medium">${totalAmount.toFixed(2)}</span></p>

          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Payment Method</h3>
          <form onSubmit={handleStripePayment} className="mt-4">
            <CardElement />
            <button
              type="submit"
              disabled={loading || !stripe}
              className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-md font-bold hover:bg-indigo-700 transition duration-200"
            >
              {loading ?  <Spinner />  : 'Pay Now'}
            </button>
          </form>

          {paymentStatus && (
            <p className={`mt-4 text-lg font-semibold ${paymentStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {paymentStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentPage totalAmount={49.99} itemTitle="Sample Item" />
    </Elements>
  );
}
