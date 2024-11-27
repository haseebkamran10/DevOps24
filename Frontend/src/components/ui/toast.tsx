import React, { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-md shadow-lg transition-transform duration-300 ease-in-out ${
        type === "success"
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-red-100 text-red-800 border border-red-300"
      }`}
      style={{
        zIndex: 9999,
        minWidth: "350px",
        animation: visible
          ? "toast-slide-down 0.3s ease-in-out"
          : "toast-slide-up 0.3s ease-in-out",
      }}
    >
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center ${
            type === "success" ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {type === "success" ? (
            <svg
              className="w-5 h-5 text-green-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5 4a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-red-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          )}
        </div>
        <div className="ml-4 text-sm font-medium">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
