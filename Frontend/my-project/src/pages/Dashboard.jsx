import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Sidebar from "../Components/Sidebar";
import StatsCard from "../Components/StatsCard";
import AnalyticsChart from "../Components/AnalyticsChart";
import PieChartBox from "../Components/PieChartBox";

function Dashboard() {
  /* ================= LOCATION ================= */

  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

  /* ================= AUTH STORE ================= */

  const { authUser } = useAuthStore();

  /* ================= STATES ================= */

  const [urls, setUrls] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [countryData, setCountryData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH DATA ================= */

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [urlsRes, deviceRes, countryRes] = await Promise.all([
        axios.get("https://url-shortener-tu9a.onrender.com/urlApi/allurls", {
          withCredentials: true,
        }),

        axios.get("https://url-shortener-tu9a.onrender.com/urlApi/analytics/device", {
          withCredentials: true,
        }),

        axios.get("https://url-shortener-tu9a.onrender.com/urlApi/analytics/country", {
          withCredentials: true,
        }),
      ]);

      setUrls(urlsRes.data.url || []);

      setDeviceData(
        (deviceRes.data.data || []).map((item) => ({
          name: item.device,
          value: item.clicks,
        })),
      );

      setCountryData(countryRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    if (!isDashboardHome) return;

    fetchDashboardData();
  }, [isDashboardHome]);

  /* ================= CALCULATIONS ================= */

  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
  const publicUrls = urls.filter((url) => url.privacy === "Public").length;
  const privateUrls = urls.filter((url) => url.privacy === "Private").length;
  const qrUrls = urls.filter((url) => url.qrEnabled === true).length;

  const topFiveUrls = [...urls]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5)
    .map((url) => ({
      name: url.shortUrl.split("/").pop(),
      clicks: url.clicks || 0,
    }));

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex">
      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 w-72 h-screen border-r border-gray-800 bg-[#111827]">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="ml-72 flex-1 p-8 overflow-y-auto">
        {!isDashboardHome ? (
          <Outlet />
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {authUser?.fName || "User"}
                </span>
              </h1>

              <p className="text-gray-400 mt-2">
                Overview of your URL analytics
              </p>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="text-gray-400 text-lg">Loading dashboard...</div>
            )}

            {/* ERROR */}
            {error && <div className="text-red-400 text-lg">{error}</div>}

            {/* CONTENT */}
            {!loading && !error && (
              <div className="space-y-10">
                {/* KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
                  <StatsCard title="Total URLs" value={totalUrls} />
                  <StatsCard title="Total Clicks" value={totalClicks} />
                  <StatsCard title="Public URLs" value={publicUrls} />
                  <StatsCard title="Private URLs" value={privateUrls} />
                  <StatsCard title="QR URLs" value={qrUrls} />
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <AnalyticsChart
                    data={topFiveUrls}
                    title="Top 5 Clicked URLs"
                    subtitle="URLs with highest engagement"
                    dataKey="clicks"
                    xKey="name"
                  />

                  <PieChartBox
                    data={deviceData}
                    title="Device Analytics"
                    subtitle="Traffic by device"
                    dataKey="value"
                    nameKey="name"
                  />
                </div>

                {/* TABLE */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
                  <h2 className="text-2xl font-semibold mb-5">Top Locations</h2>

                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 text-sm">
                        <th className="text-left">Country</th>
                        <th className="text-left">Clicks</th>
                      </tr>
                    </thead>

                    <tbody>
                      {countryData.map((country, index) => (
                        <tr key={index} className="border-t border-white/10">
                          <td className="py-3">
                            {country.country || "Unknown"}
                          </td>
                          <td className="py-3">{country.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* OPTIONAL MANUAL REFRESH */}
                  <button
                    onClick={fetchDashboardData}
                    className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                  >
                    Refresh Dashboard
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
