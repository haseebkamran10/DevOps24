import React from "react";
import { useLocation } from "react-router-dom";

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { imageUrl, itemTitle, deliveryDetails } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50 font-sans">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6 text-center animate-pulse">
        🎉 Congratulations! 🎉
      </h1>
      <p className="text-4xl font-bold text-indigo-800 mb-6 text-center animate-pulse">
        🎉 Payment Successful! 🎉
      </p>
      <img
        src={imageUrl || "/confirmation.jpg"}
        alt="Celebration"
        className="mb-6 w-full max-w-md rounded-3xl shadow-lg"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.jpg"; // Fallback image
        }}
      />
      <div className="bg-white p-8 rounded-3xl shadow-md w-full max-w-lg text-center">
        <p className="text-lg text-gray-700 mb-4">
          Thank you for completing your journey with us!
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Your package <strong>{itemTitle}</strong> will be delivered to:
        </p>
        {deliveryDetails && (
          <div className="text-left">
            <p>
              <strong>Name:</strong> {deliveryDetails.name}
            </p>
            <p>
              <strong>Address:</strong> {deliveryDetails.address}
            </p>
            <p>
              <strong>City:</strong> {deliveryDetails.city}
            </p>
            <p>
              <strong>Postal Code:</strong> {deliveryDetails.postalCode}
            </p>
            <p>
              <strong>Country:</strong> {deliveryDetails.country}
            </p>
            <p>
              <strong>Phone Number:</strong> {deliveryDetails.phoneNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
