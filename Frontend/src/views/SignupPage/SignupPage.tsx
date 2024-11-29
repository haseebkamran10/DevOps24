import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../services/UserService"; // Ensure the path is correct
import Spinner from "../../components/ui/spinner"; // Adjust the path as needed
import Toast from  "../../components/ui/toast"; // Adjust the path as needed


const SignupPage = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(""); // Optional username
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState(""); // Dummy password
  const [confirmPassword, setConfirmPassword] = useState(""); // Dummy confirm password
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error") => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 50); 
  };

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    const user = {
      firstName,
      lastName,
      username: username || undefined,
      email,
      phoneNumber: phoneNumber || undefined,
      addressLine: addressLine || undefined,
      city: city || undefined,
      zip: zip || undefined,
      country,
    };

    setIsLoading(true);

    try {
      await addUser(user);
      showToast(`Registration successful! Welcome, ${firstName}.`, "success");

        setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error.message);
      showToast(error.message || "Registration failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
     {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <img
        ref={bannerRef}
        src="login_banner.jpg"
        alt="Signup Banner"
        className="fixed inset-0 w-full h-dvh object-cover transition-transform duration-300"
        style={{ opacity: 0.85 }}
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div
          className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg border border-gray-200"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            Sign up for an account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username (Optional)
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label
                htmlFor="addressLine"
                className="block text-sm font-medium text-gray-700"
              >
                Address (Optional)
              </label>
              <input
                type="text"
                id="addressLine"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City (Optional)
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP Code (Optional)
              </label>
              <input
                type="text"
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your ZIP code"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your country"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-bold ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
              disabled={isLoading}
            >
               {isLoading ? <Spinner /> : "Sign Up"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
