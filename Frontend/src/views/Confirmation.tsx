import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { imageUrl, itemTitle } = location.state || {}; // Extract state passed during navigation
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userInfo");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    } else {
      console.warn("User details are not available in localStorage.");
    }
  }, []);

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
        {userDetails ? (
          <div className="text-left">
            <p>
              <strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}
            </p>
            <p>
              <strong>Address:</strong> {userDetails.addressLine}
            </p>
            <p>
              <strong>City:</strong> {userDetails.city}
            </p>
            <p>
              <strong>Postal Code:</strong> {userDetails.zip}
            </p>
            <p>
              <strong>Country:</strong> {userDetails.country}
            </p>
            <p>
              <strong>Phone Number:</strong> {userDetails.phoneNumber}
            </p>
          </div>
        ) : (
          <p className="text-red-600">User details not found. Please log in again.</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
