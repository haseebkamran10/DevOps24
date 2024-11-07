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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 lg:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
        
        {/* Delivery Section */}
        <div className="w-full lg:w-2/3 bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Delivery Information</h3>
          
          <div className="space-y-4">
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

        {/* Cart & Payment Section */}
        <div className="w-full lg:w-1/3 bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Cart</h3>
          <div className="mb-6">
            <p className="text-gray-600">Product: <span className="font-medium">{itemTitle}</span></p>
            <p className="text-gray-600">Total: <span className="font-medium">${totalAmount.toFixed(2)}</span></p>
          </div>

          <form className="mt-6" onSubmit={handlePayment}>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Payment Method</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => handlePaymentMethodChange('card')}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Pay with Card</span>
                <img src="/icons/atm-card.png" alt="Card" className="ml-2 h-6" />
              </div>
              {selectedPaymentMethod === 'card' && (
                <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-600">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentInputChange}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-white"
                        placeholder="1234 5678 9123 4567"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-600">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentInputChange}
                          required
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-white"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-600">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentInputChange}
                          required
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-white"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center mt-4">
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedPaymentMethod === 'paypal'}
                onChange={() => handlePaymentMethodChange('paypal')}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Pay with PayPal</span>
              <img src="/icons/paypal.png" alt="PayPal" className="ml-2 h-6" />
            </div>

            <div className="flex items-center mt-4">
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedPaymentMethod === 'mobilepay'}
                onChange={() => handlePaymentMethodChange('mobilepay')}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Pay with MobilePay</span>
              <img src="/icons/mobilpay.png" alt="MobilePay" className="ml-2 h-6" />
            </div>
            {selectedPaymentMethod === 'mobilepay' && (
              <div className="mt-4">
                <label htmlFor="mobilePayPhoneNumber" className="block text-sm font-medium text-gray-600">MobilePay Phone Number</label>
                <input
                  type="tel"
                  id="mobilePayPhoneNumber"
                  name="mobilePayPhoneNumber"
                  value={mobilePayPhoneNumber}
                  onChange={(e) => setMobilePayPhoneNumber(e.target.value)}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="+45 31455327"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md font-bold hover:bg-indigo-700 transition duration-200"
            >
              Confirm Payment
            </button>
          </form>

          {paymentStatus && (
            <p className="mt-4 text-lg font-semibold text-green-600">
              {paymentStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
