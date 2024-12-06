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
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 text-center animate-pulse">
        🎉 Congratulations! 🎉
      </h1>
      <p className="text-3xl font-semibold text-indigo-800 mb-8 text-center">
        Payment Successful!
      </p>

      {/* Image */}
      <img
        src={imageUrl || "/confirmation.jpg"}
        alt="Celebration"
        className="mb-6 w-full max-w-md rounded-3xl shadow-lg"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.jpg"; // Fallback image
        }}
      />

      {/* Details Section */}
      <div className="bg-white p-6 rounded-3xl shadow-md w-full max-w-lg text-center">
        <p className="text-lg text-black mb-4">
          Thank you for completing your journey with us!
        </p>
        <p className="text-lg text-black mb-4">
          Your package <strong>{itemTitle}</strong> will be delivered to:
        </p>

        {/* User Details */}
        {userDetails ? (
          <p className="text-lg text-black">
            <strong>Address:</strong> {userDetails.addressLine}, {userDetails.city}, {userDetails.zip}, {userDetails.country}
          </p>
        ) : (
          <p className="text-red-600">User details not found. Please log in again.</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
