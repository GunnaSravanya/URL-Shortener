function StatsCard({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 h-[140px] flex flex-col justify-between">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-400 text-sm font-medium tracking-wide">
          {title}
        </h2>

        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-lg shadow-purple-500/30" />
      </div>

      {/* VALUE */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          {value}
        </h1>

        <p className="text-xs text-gray-500 mt-2">Live analytics update</p>
      </div>
    </div>
  );
}

export default StatsCard;
