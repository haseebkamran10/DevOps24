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

const PaymentPage: React.FC<PaymentPageProps> = ({ totalAmount, itemTitle }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  });

  const [mobilePayPhoneNumber, setMobilePayPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>('stripe');
  const [loading, setLoading] = useState(false);

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cardNumber' && !/^\d{0,16}$/.test(value)) return;
    if (name === 'expiryDate' && !/^\d{0,2}\/?\d{0,2}$/.test(value)) return;
    if (name === 'cvv' && !/^\d{0,3}$/.test(value)) return;

    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });
  };

  const handleDeliveryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'postalCode' && !/^\d{0,5}$/.test(value)) return;
    if (name === 'phoneNumber' && !/^\+?\d{0,15}$/.test(value)) return;

    setDeliveryDetails({
      ...deliveryDetails,
      [name]: value,
    });
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
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
      const response = await fetch('https://localhost:5001/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to create payment intent: ${errorDetails}`);
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: deliveryDetails.name,
            email: 'customer@example.com',
          },
        },
      });

      if (result.error) {
        setPaymentStatus(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentStatus('Payment successful!');
        setTimeout(() => navigate('/confirmation'), 2000);
      }
    } catch (error: any) {
      setPaymentStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const { cardNumber, expiryDate, cvv } = paymentDetails;

    if (selectedPaymentMethod === 'card') {
      if (cardNumber.length !== 16 || expiryDate.length !== 5 || cvv.length !== 3) {
        setPaymentStatus('Invalid card details. Please check the information.');
        return;
      }
    } else if (selectedPaymentMethod === 'mobilepay' && (!/^\d+$/.test(mobilePayPhoneNumber) || mobilePayPhoneNumber.length < 8)) {
      setPaymentStatus('Please provide a valid MobilePay phone number.');
      return;
    }

    setPaymentStatus('Payment successful!');
    setTimeout(() => {
      navigate('/confirmation');
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 lg:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Delivery Section */}
          <div className="w-full lg:w-2/3 bg-white p-8 rounded-lg shadow-lg text-black">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Delivery Information</h3>
          
          <div className="space-y-4 text-left">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={deliveryDetails.name}
                onChange={handleDeliveryInputChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Lars"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={deliveryDetails.address}
                onChange={handleDeliveryInputChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Morbærhaven"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-600">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={deliveryDetails.city}
                onChange={handleDeliveryInputChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Albertslund"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-600">Postal Code:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={deliveryDetails.postalCode}
                onChange={handleDeliveryInputChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="2620"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-600">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={deliveryDetails.country}
                onChange={handleDeliveryInputChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Denmark"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={deliveryDetails.phoneNumber}
                onChange={handleDeliveryInputChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="+45 31455327"
              />
            </div>
          </div>
        </div>
   {/* Payment Section */}
   <div className="w-full lg:w-1/3 bg-white p-8 rounded-lg shadow-lg text-black">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Cart</h3>
          <div className="mb-6">
            <p className="text-gray-600">Product: <span className="font-medium">{itemTitle}</span></p>
            <p className="text-gray-600">Total: <span className="font-medium">${totalAmount.toFixed(2)}</span></p>
          </div>

          <form className="mt-6" onSubmit={handlePayment}>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Payment Method</h3>

            <div className="space-y-4">
              <div
                onClick={() => handlePaymentMethodChange('card')}
                className={`flex flex-col p-4 border rounded-lg cursor-pointer 
                ${selectedPaymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <img
                    src="/icons/atm-card.png"
                    alt="Card Icon"
                    className="h-6 mr-3"
                  />
                  <span className="text-gray-700">Pay with Card</span>
                </div>
                {selectedPaymentMethod === 'card' && (
  
                    <form onSubmit={handleStripePayment} className="mt-4">
              <CardElement />
              <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-md font-bold hover:bg-indigo-700 transition duration-200"
              >
                {loading ? <Spinner /> : 'Pay with Stripe'}
              </button>
            </form>
      
                )}
              </div>

              <div
                onClick={() => handlePaymentMethodChange('paypal')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer 
                ${selectedPaymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
              >
                <img
                  src="/icons/paypal.png"
                  alt="PayPal Icon"
                  className="h-6 mr-3"
                />
                <span className="text-gray-700">Pay with PayPal</span>
              
                
              </div>
              

              <div
                onClick={() => handlePaymentMethodChange('mobilepay')}
                className={`flex flex-col p-4 border rounded-lg cursor-pointer 
                ${selectedPaymentMethod === 'mobilepay' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <img
                    src="/icons/mobilpay.png"
                    alt="MobilePay Icon"
                    className="h-6 mr-3"
                  />
                  <span className="text-gray-700">Pay with MobilePay</span>
                </div>
                {selectedPaymentMethod === 'mobilepay' && (
                  <div className="mt-4">
                    <label htmlFor="mobilePayPhoneNumber" className="block text-sm font-medium text-gray-600">MobilePay Phone Number</label>
                    <input
                      type="tel"
                      id="mobilePayPhoneNumber"
                      name="mobilePayPhoneNumber"
                      value={mobilePayPhoneNumber}
                      onChange={(e) => {
                        // Validate to ensure only numbers are input
                        if (/^\d*$/.test(e.target.value)) {
                          setMobilePayPhoneNumber(e.target.value);
                        }
                      }}
                      required
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-white"
                      placeholder="+45 31455327"
                    />
                          <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-md font-bold hover:bg-indigo-700 transition duration-200"
              >
                {loading ? <Spinner /> : 'Pay'}
              </button>
                  </div>
                )}
              </div>
            </div>
            </form>
          {/* Stripe Payment */}
          {selectedPaymentMethod === 'Pay with Card' && (
            <form onSubmit={handleStripePayment} className="mt-4">
              <CardElement />
              <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-md font-bold hover:bg-indigo-700 transition duration-200"
              >
                {loading ? <Spinner /> : 'Pay'}
              </button>
            </form>
          )}
          {/* Payment Status */}
          {paymentStatus && (
            <div className="mt-6 text-center text-gray-800">
              <p>{paymentStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPage totalAmount={49.99} itemTitle="Sample Item" />
    </Elements>
  );
}
