import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Login() {
  //to store login credentials
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //to store error message
  const [error, setError] = useState("");

  //for navigation after login
  const navigate = useNavigate();

  //zustand auth store
  const { login } = useAuthStore();

  //function to update state
  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  //function to submit form
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const result = await login(user.email, user.password);

    if (result.success) {
      const loggedUser = useAuthStore.getState().user;

      //check role and navigate
      if (loggedUser.role === "Admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col">
      {/* Navbar */}

      <Navbar />

      {/* Login Section */}

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          {/* Heading */}

          <h1 className="text-3xl font-bold text-center">
            Welcome
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Back
            </span>
          </h1>

          {/* Description */}

          <p className="text-gray-400 text-center mt-3">
            Login to manage your URLs and analytics.
          </p>

          {/* Error Message */}

          {error && (
            <p className="text-red-400 text-sm text-center mt-4">{error}</p>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            {/* Email */}

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Email</label>

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
              />
            </div>

            {/* Password */}

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Password</label>

              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
              />
            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              Login
            </button>
          </form>

          {/* Register Redirect */}

          <p className="text-gray-400 text-sm text-center mt-6">
            Don’t have an account?
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 ml-2"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}

      <Footer />
    </div>
  );
}

export default Login;
