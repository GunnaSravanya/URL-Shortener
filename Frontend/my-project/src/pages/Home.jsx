import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col">
      {/* Navbar */}

      <Navbar />

      {/* Hero Section */}

      <div className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Heading */}

        <h1 className="text-4xl md:text-7xl font-bold leading-tight max-w-5xl">
          Shorten URLs
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {" "}
            Smarter
          </span>
          <br />
          Track Every Click
        </h1>

        {/* Description */}

        <p className="mt-8 text-gray-400 text-lg md:text-xl max-w-3xl leading-relaxed">
          Create secure short URLs, monitor analytics, manage links, and track
          performance with a futuristic dashboard experience.
        </p>

        {/* CTA Button */}

        <div className="mt-12">
          <Link
            to="/register"
            className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            Get Started
          </Link>
        </div>

        {/* Analytics Preview Cards */}

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1 */}

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300">
            <p className="text-4xl font-bold text-blue-400">URLs Shortened</p>
          </div>

          {/* Card 2 */}

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300">
            <p className="text-4xl font-bold text-blue-400">Clicks Tracked</p>
          </div>

          {/* Card 3 */}

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300">
            <p className="text-4xl font-bold text-blue-400">Secure Redirects</p>
          </div>
        </div>
      </div>

      {/* Footer */}

      <Footer />
    </div>
  );
}

export default Home;
