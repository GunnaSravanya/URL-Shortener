import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get(
          `https://url-shortener-tu9a.onrender.com/urlApi/particularUrl/${id}`,
          { withCredentials: true },
        );

        setUrl(res.data.url);
        setAnalytics(res.data.analytics || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [id]);

  const countryMap = {};
  analytics.forEach((item) => {
    const country = item.country || "Unknown";
    countryMap[country] = (countryMap[country] || 0) + 1;
  });

  const countryData = Object.keys(countryMap).map((country) => ({
    country,
    clicks: countryMap[country],
  }));

  const deviceMap = {};
  analytics.forEach((item) => {
    const device = item.device || "desktop";
    deviceMap[device] = (deviceMap[device] || 0) + 1;
  });

  const deviceData = Object.keys(deviceMap).map((device) => ({
    device,
    clicks: deviceMap[device],
  }));

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B"];

  function handleDownloadQR() {
    const link = document.createElement("a");
    link.href = url.qrCode;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        <h1 className="text-2xl text-gray-400">Loading analytics...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        <h1 className="text-2xl text-red-400">{error}</h1>
      </div>
    );
  }
  async function handleRedirectCheck(shortCode) {
    try {
      const res = await axios.get(
        `https://url-shortener-tu9a.onrender.com/urlApi/check/${shortCode}`,
        {
          withCredentials: true,
        },
      );

      if (!res.data || res.data.status !== "ok") {
        alert(res.data?.message || "Link not available");
        return;
      }

      window.open(`https://url-shortener-tu9a.onrender.com/urlApi/${shortCode}`, "_blank");
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-4xl font-bold">URL Analytics</h1>
            <p className="text-gray-400 mt-2">
              Detailed analytics for your shortened URL
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/myurls")}
            className="px-6 py-3 rounded-2xl bg-[#111827] border border-gray-700 hover:bg-[#1A2235] transition-all duration-300"
          >
            Back to My URLs
          </button>
        </div>

        {/* URL DETAILS */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 mb-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <div className="flex flex-col">
              <div>
                <p className="text-sm text-gray-400 mb-2">Short URL</p>
                <button
                  onClick={() => handleRedirectCheck(url.shortCode)}
                  className="text-indigo-400 text-lg break-all hover:text-indigo-300 transition text-left"
                >
                  {`http://localhost:4000/urlApi/${url.shortCode}`}
                </button>

                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-2">Original URL</p>
                  <p className="text-gray-300 break-all">{url.originalUrl}</p>
                </div>
              </div>

              {/* QR MOVED HERE (fills empty bottom space) */}
              {url.qrEnabled && url.qrCode && (
                <div className="mt-auto flex flex-col items-start pt-8">
                  <img
                    src={url.qrCode}
                    alt="QR Code"
                    className="w-40 h-40 rounded-2xl border border-gray-700"
                  />

                  <button
                    onClick={handleDownloadQR}
                    className="mt-4 px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
                  >
                    Download QR
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE (UNCHANGED) */}
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-[#0B0F1A] border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Total Clicks</p>
                <h2 className="text-3xl font-bold mt-2">{url.clicks || 0}</h2>
              </div>

              <div className="bg-[#0B0F1A] border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Privacy</p>
                <h2 className="text-xl font-semibold mt-2">{url.privacy}</h2>
              </div>

              <div className="bg-[#0B0F1A] border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Purpose</p>
                <h2 className="text-xl font-semibold mt-2">{url.purpose}</h2>
              </div>

              <div className="bg-[#0B0F1A] border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">QR Enabled</p>
                <h2 className="text-xl font-semibold mt-2">
                  {url.qrEnabled ? "Yes" : "No"}
                </h2>
              </div>

              <div className="bg-[#0B0F1A] border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Created On</p>
                <h2 className="text-xl font-semibold mt-2">
                  {url.createdAt
                    ? new Date(url.createdAt).toLocaleDateString()
                    : "N/A"}
                </h2>
              </div>

              <div className="bg-[#0B0F1A] border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Expiry</p>
                <h2 className="text-xl font-semibold mt-2">
                  {url.expiresAt
                    ? new Date(url.expiresAt).toLocaleDateString()
                    : "No Expiry"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS (RESTORED STYLE) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* COUNTRY BAR */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
            <h2 className="text-2xl font-semibold mb-7">Country Analytics</h2>

            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1F2937"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="country"
                    stroke="#9CA3AF"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="clicks"
                    fill="#6366F1"
                    radius={[10, 10, 0, 0]}
                    barSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DEVICE PIE */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7">
            <h2 className="text-2xl font-semibold mb-7">Device Usage</h2>

            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="clicks"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-7 mt-10">
          <h2 className="text-2xl font-semibold mb-7">Click History</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left px-4">Country</th>
                  <th className="text-left px-4">City</th>
                  <th className="text-left px-4">Device</th>
                  <th className="text-left px-4">Browser</th>
                  <th className="text-left px-4">OS</th>
                </tr>
              </thead>

              <tbody>
                {analytics.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white/[0.03] hover:bg-white/[0.06]"
                  >
                    <td className="px-4 py-4">{item.country}</td>
                    <td className="px-4 py-4">{item.city}</td>
                    <td className="px-4 py-4">{item.device}</td>
                    <td className="px-4 py-4">{item.browser}</td>
                    <td className="px-4 py-4">{item.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
