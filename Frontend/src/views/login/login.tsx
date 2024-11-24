import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/loginService";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUserName, setUserAvatar } = useAuth(); // Use Auth context
  const navigate = useNavigate();

  console.log("Email:", username);
  console.log("Password:", password);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (username.trim() === "" || password.trim() === "") {
      alert("Please fill out both fields.");
      return;
    }
  
    try {
      const response = await loginUser({ email: username, password });
  
      if (!response.userId) {
        console.error("Login response is missing userId. Full response:", response);
        throw new Error("User ID is missing from the response.");
      }
      
      console.log("Login successful:", response);
  
      // Update context or application state
      setUserName(response.name);
      setUserAvatar(null); // Replace with avatar handling if available
  
      // Store the token and user's name in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("userName", response.name);
      localStorage.setItem("userId", response.userId.toString()); // Ensure userId exists before calling .toString()
  
      // Redirect to the profile page
      navigate("/profile");
    } catch (err: any) {
      console.error("Login error:", err.message);
      setError(err.response?.data?.error || "An error occurred during login.");
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
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your email"
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
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Sign In
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
    </>
  );
};

export default LoginPage;
