import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { startSession } from "../../services/SessionService"; // Ensure the correct path
import { getUserByPhoneNumber } from "../../services/UserService"; // Import the getUser function
import Spinner from "../../components/ui/spinner"; // Adjust the path as needed
import Toast from  "../../components/ui/toast"; // Adjust the path as needed

const LoginPage = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (phoneNumber.trim() === "") {
      setToast({ message: "Please enter your phone number.", type: "error" });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const sessionId = await startSession({ phoneNumber });
      console.log("Session started successfully:", sessionId);

      // Save the session ID and phone number locally
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("phoneNumber", phoneNumber);

      // Fetch user details after the session starts
      const user = await getUserByPhoneNumber(phoneNumber);
      // Save user details and username in localStorage
      localStorage.setItem("userDetails", JSON.stringify(user));
      localStorage.setItem("username", `${user.firstName} ${user.lastName}`);

      // Navigate to profile page
      setToast({ message: "Login successful!", type: "success" });
      setTimeout(() => navigate("/profile"), 1000); // Delay navigation for better UX
    } catch (err: any) {
      console.error("Login error:", err.message);
      setToast({ message: err.message || "An error occurred during login.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img
        ref={bannerRef}
        src="login_banner.jpg"
        alt="Login Banner"
        className="fixed inset-0 w-full h-dvh object-cover transition-transform duration-300"
        style={{ opacity: 0.85 }}
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div
          className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg border border-gray-200"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            Sign in to your account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default LoginPage;
