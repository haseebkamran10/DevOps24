import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserByPhoneNumber } from "../services/UserService";
const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { imageUrl, itemTitle, phoneNumber } = location.state || {}; 
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (phoneNumber) {
          const userDetails = await getUserByPhoneNumber(phoneNumber);
          setDeliveryDetails(userDetails);
        } else {
          throw new Error("Phone number is missing.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [phoneNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Loading delivery details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Error: {error}</p>
      </div>
    );
  }

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
          e.currentTarget.src = "/placeholder.jpg";
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
              <strong>Name:</strong> {deliveryDetails.firstName}{" "}
              {deliveryDetails.lastName}
            </p>
            <p>
              <strong>Address:</strong> {deliveryDetails.addressLine}
            </p>
            <p>
              <strong>City:</strong> {deliveryDetails.city}
            </p>
            <p>
              <strong>Postal Code:</strong> {deliveryDetails.zip}
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
