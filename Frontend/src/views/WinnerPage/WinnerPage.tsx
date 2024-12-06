import React from "react";
import { useNavigate , useLocation  } from "react-router-dom";

interface WinnerPageProps {
  winnerName?: string;
  itemTitle?: string;
  auctionEndDate?: string;
}

const WinnerPage: React.FC<WinnerPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { winnerName, itemTitle, auctionEndDate, imageUrl,highestBid } = location.state || {};
  const handleNavigateToPayment = () => {
    navigate('/paymentpage', {
      state: {
        winnerName: winnerName,
        itemTitle: itemTitle,
        imageUrl:imageUrl,
        highestBid: highestBid,
      },
    });
  };
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50 font-sans">
      <h1 className="text-4xl font-semibold text-indigo-800 mb-4 text-center animate-pulse">
        🎉 Congratulations, {winnerName}! 🎉
      </h1>
      <img
      
        src={imageUrl || "/hardCoded pic 1.jpg"}
        alt="Winner Celebration"
        onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
        className="mb-6 w-full max-w-md rounded-3xl shadow-lg"
      />

      <div className="bg-white p-6 rounded-3xl shadow-md w-full max-w-lg mb-6 text-center">
        <p className="text-lg text-gray-700 mb-4">
          You are now the proud owner of <strong>{itemTitle}</strong>
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Your winning item is prepared and ready for its journey to you.
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-medium">Auction Ended:</span> <strong>{auctionEndDate}</strong>
        </p>
      </div>

      <div className="flex gap-4">
        <button
          className="relative bg-indigo-600 text-white py-3 px-10  text-lg font-semibold shadow-lg  hover:bg-indigo-700  focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleNavigateToPayment}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-20 rounded-full"></span>
          <span className="relative">Proceed to Payment</span>
        </button>
      </div>
    </div>
  );
};

export default WinnerPage;