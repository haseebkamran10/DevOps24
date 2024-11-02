import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentPageProps {
  totalAmount: number;
  itemTitle: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ totalAmount, itemTitle }) => {
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

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [mobilePayPhoneNumber, setMobilePayPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });
  };

  const handleDeliveryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails({
      ...deliveryDetails,
      [name]: value,
    });
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing
    if (paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvv) {
      setPaymentStatus('Payment successful!');
      setTimeout(() => {
        navigate('/confirmation');
      }, 2000);
    } else {
      setPaymentStatus('Payment failed. Please fill in all details.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Checkout</h1>

      {/* Responsive layout with flex */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left: Delivery Section */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-black">Delivery Information</h3>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={deliveryDetails.name}
              onChange={handleDeliveryInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              placeholder="Lars"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={deliveryDetails.address}
              onChange={handleDeliveryInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              placeholder="Morbærhaven"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={deliveryDetails.city}
              onChange={handleDeliveryInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              placeholder="Albertslund"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code:</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={deliveryDetails.postalCode}
              onChange={handleDeliveryInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              placeholder="2620"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={deliveryDetails.country}
              onChange={handleDeliveryInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              placeholder="Denmark"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={deliveryDetails.phoneNumber}
              onChange={handleDeliveryInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
              placeholder="+45 31455327"
            />
          </div>
        </div>

        {/* Right: Cart & Payment Section */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-black">Your Cart</h3>
          <div className="mb-5">
            <p className="text-sm text-gray-600">Product: {itemTitle}</p>
            <p className="text-sm text-gray-600">Total: ${totalAmount.toFixed(2)}</p>
          </div>

          <form className="mt-4" onSubmit={handlePayment}>
            <h3 className="text-xl font-semibold mb-4 text-black">How would you like to pay?</h3>

            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => handlePaymentMethodChange('card')}
                  className="form-radio h-4 w-4 text-indigo-600 bg-white"
                />
                <span className="ml-2 text-gray-700">Pay with Card</span>
                <img src="/icons/atm-card.png" alt="Card" className="ml-2 h-6" />
              </label>
              {selectedPaymentMethod === 'card' && (
                <div className="p-4 border border-gray-300 rounded-md">
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number:</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentInputChange}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                      placeholder="1234 5678 9123 4567"
                    />
                  </div>
                  <div className="mb-4 flex space-x-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date:</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentDetails.expiryDate}
                        onChange={handlePaymentInputChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV:</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentInputChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={() => handlePaymentMethodChange('paypal')}
                  className="form-radio h-4 w-4 text-indigo-600 bg-white"
                />
                <span className="ml-2 text-gray-700">Pay with PayPal</span>
                <img src="/icons/paypal.png" alt="PayPal" className="ml-2 h-6" />
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'mobilepay'}
                  onChange={() => handlePaymentMethodChange('mobilepay')}
                  className="form-radio h-4 w-4 text-indigo-600 bg-white"
                />
                <span className="ml-2 text-gray-700">Pay with MobilePay</span>
                <img src="/icons/mobilpay.png" alt="MobilePay" className="ml-2 h-6" />
              </label>
              {selectedPaymentMethod === 'mobilepay' && (
                <div className="mt-4">
                  <label htmlFor="mobilePayPhoneNumber" className="block text-sm font-medium text-gray-700">MobilePay Phone Number:</label>
                  <input
                    type="tel"
                    id="mobilePayPhoneNumber"
                    name="mobilePayPhoneNumber"
                    value={mobilePayPhoneNumber}
                    onChange={(e) => setMobilePayPhoneNumber(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                    placeholder="+45 31455327"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#535bf2] text-white py-2 rounded-md hover:bg-gray-800">
              Confirm Payment
            </button>
          </form>

          {paymentStatus && <p className="mt-2 text-lg text-green-600 mb-4">{paymentStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
