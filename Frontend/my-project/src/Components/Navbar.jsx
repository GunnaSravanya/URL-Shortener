import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-[#0B0F1A]/80 backdrop-blur-lg text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}

        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          GetShortify
        </h1>

        {/* Navigation Links */}

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="hover:text-purple-400 transition-all duration-300"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="hover:text-purple-400 transition-all duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-all duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
