import React from "react";

const ConfirmationPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50 font-sans">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6 text-center animate-pulse">
        🎉 Congratulations! 🎉
        
      </h1>
      <p className="text-4xl font-bold text-indigo-800 mb-6 text-center animate-pulse"> 🎉 Payment Successful! 🎉</p>
      <img
        src="/confirmation.jpg"
        alt="Celebration"
        className="mb-6 w-full max-w-md rounded-3xl shadow-lg"
      />
      <div className="bg-white p-8 rounded-3xl shadow-md w-full max-w-lg text-center">
        <p className="text-lg text-gray-700 mb-4">
          Thank you for completing your journey with us!
        </p>
        <p className="text-lg text-gray-700 mb-4">
          We’re thrilled to celebrate this moment with you.
        </p>
      </div>
      <div className="mt-8 flex gap-4">
      </div>
    </div>
  );
};

export default ConfirmationPage;
