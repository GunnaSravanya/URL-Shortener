import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  //to store form data
  const [user, setUser] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
  });

  //to store error message
  const [error, setError] = useState("");

  //to navigate after successful registration
  const navigate = useNavigate();

  const { setAuthUser } = useAuthStore();

  //function to update state whenever user types
  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  //function to submit form
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/commonApi/register",
        user,
      );

      alert(res.data.message);

      navigate("/login"); // ONLY THIS
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col">
      {/* Navbar */}

      <Navbar />

      {/* Register Section */}

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          {/* Heading */}

          <h1 className="text-3xl font-bold text-center">
            Create Your
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Account
            </span>
          </h1>

          {/* Description */}

          <p className="text-gray-400 text-center mt-3">
            Start shortening and tracking your URLs.
          </p>

          {/* Error Message */}

          {error && (
            <p className="text-red-400 text-sm text-center mt-4">{error}</p>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            {/* First Name */}

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">First Name</label>

              <input
                type="text"
                name="fName"
                value={user.fName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
              />
            </div>

            {/* Last Name */}

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Last Name</label>

              <input
                type="text"
                name="lName"
                value={user.lName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
              />
            </div>

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

            {/* Register Button */}

            <button
              type="submit"
              className="mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              Register
            </button>
          </form>

          {/* Login Redirect */}

          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 ml-2"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}

      <Footer />
    </div>
  );
}

export default Register;
