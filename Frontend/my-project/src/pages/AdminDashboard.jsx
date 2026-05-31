import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

import AdminSidebar from "../Components/AdminSidebar";
import StatsCard from "../Components/StatsCard";
import AnalyticsChart from "../Components/AnalyticsChart";
import PieChartBox from "../Components/PieChartBox";

function AdminDashboard() {
  /* ================= LOCATION ================= */

  const location = useLocation();
  const isAdminHome = location.pathname === "/admindashboard";

  /* ================= AUTH STORE ================= */

  const { authUser } = useAuthStore();

  /* ================= STATES ================= */

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalUrls: 0,
    totalClicks: 0,
    privateUrls: 0,
    publicUrls: 0,
    qrGenerated: 0,
  });

  const [monthlyUrls, setMonthlyUrls] = useState([]);
  const [deviceStats, setDeviceStats] = useState([]);
  const [countryStats, setCountryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://url-shortener-tu9a.onrender.com/adminApi/dashboard",
        {
          withCredentials: true,
        },
      );

      setDashboard(response.data.stats);
      setMonthlyUrls(response.data.monthlyUrls);
      setDeviceStats(response.data.deviceStats);
      setCountryStats(response.data.countryStats);
    } catch (err) {
      console.log(err);

      // optional fallback reset (prevents stale UI on error)
      setDashboard({
        totalUsers: 0,
        totalUrls: 0,
        totalClicks: 0,
        privateUrls: 0,
        publicUrls: 0,
        qrGenerated: 0,
      });

      setMonthlyUrls([]);
      setDeviceStats([]);
      setCountryStats([]);
    } finally {
      setLoading(false);
    }
    console.log(response.data.countryStats);
setCountryStats(response.data.countryStats);
  };

  /* ================= USE EFFECT (AUTO REFRESH) ================= */

  useEffect(() => {
    if (!isAdminHome) return;

    fetchDashboard();
  }, [isAdminHome]);

  /* ================= LOADING ================= */

  if (loading && isAdminHome) {
    return (
      <div className="bg-black text-white min-h-screen">
        <AdminSidebar />

        <div className="ml-72 min-h-screen flex items-center justify-center">
          Loading dashboard...
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="bg-black text-white min-h-screen flex">
      {/* ================= SIDEBAR ================= */}
      <AdminSidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-72 flex-1 p-6 overflow-y-auto">
        {/* ================= NESTED ROUTES ================= */}
        {!isAdminHome ? (
          <Outlet />
        ) : (
          <div className="space-y-6">
            {/* ================= TITLE ================= */}
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {authUser?.fName || "Admin"}
                </span>
              </h1>

              <p className="text-gray-400 mt-1">
                Platform analytics and management overview
              </p>
            </div>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <StatsCard title="Total Users" value={dashboard.totalUsers} />
              <StatsCard title="Total URLs" value={dashboard.totalUrls} />
              <StatsCard title="Total Clicks" value={dashboard.totalClicks} />
              <StatsCard title="Private URLs" value={dashboard.privateUrls} />
              <StatsCard title="Public URLs" value={dashboard.publicUrls} />
              <StatsCard title="QR Generated" value={dashboard.qrGenerated} />
            </div>

            {/* ================= GRAPHS ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
              <AnalyticsChart
                data={monthlyUrls}
                title="Monthly URL Creations"
                subtitle="URLs created every month"
                dataKey="urls"
                xKey="month"
                badge="Admin"
              />

              <PieChartBox
                data={deviceStats}
                title="Device Distribution"
                subtitle="Traffic across all devices"
                dataKey="value"
                nameKey="name"
                badge="Admin"
                admin={true}
              />
            </div>

            {/* ================= COUNTRY TABLE ================= */}
            <div className="bg-[#081028] border border-[#1F2A44] rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Country Analytics</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Users, URLs and clicks by country
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#1F2A44]">
                <table className="w-full">
                  <thead className="bg-[#0B1739]">
                    <tr className="text-left">
                      <th className="py-4 px-5 text-gray-300">Country</th>
                      <th className="py-4 px-5 text-gray-300">Users</th>
                      <th className="py-4 px-5 text-gray-300">URLs</th>
                      <th className="py-4 px-5 text-gray-300">Clicks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {countryStats.length > 0 ? (
                      countryStats.map((country, index) => (
                        <tr
                          key={index}
                          className="border-t border-[#1F2A44] hover:bg-[#0B1739] transition"
                        >
                          <td className="py-4 px-5">{country.country}</td>
                          <td className="py-4 px-5">{country.users}</td>
                          <td className="py-4 px-5">{country.urls}</td>
                          <td className="py-4 px-5">{country.clicks}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-8 text-gray-400"
                        >
                          No country analytics available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
