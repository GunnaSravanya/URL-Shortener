function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0F1A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col items-center justify-center text-center">
        {/* Logo */}

        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          GetShortify
        </h1>

        {/* Tagline */}

        <p className="text-gray-400 text-sm mt-2">
          Smart URL shortening with modern analytics.
        </p>

        {/* Copyright */}

        <p className="text-gray-500 text-xs mt-4">
          © 2026 GetShortify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
