import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function CreateUrl() {
  const { user } = useAuthStore();

  const [urlData, setUrlData] = useState({
    originalUrl: "",
    customAlias: "",
    expiryType: "",
    expiryValue: "",
    qrEnabled: false,
    purpose: "General",
    privacy: "Public",
  });

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  //handle input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setUrlData({
      ...urlData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  //handle form submit
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const res = await axios.post(
        "https://url-shortener-tu9a.onrender.com/urlApi/shorturl",
        urlData,
        {
          withCredentials: true,
        },
      );

      setResult(res.data);

      //reset form after success
      setUrlData({
        originalUrl: "",
        customAlias: "",
        expiryType: "",
        expiryValue: "",
        qrEnabled: false,
        purpose: "General",
        privacy: "Public",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-5">
            URL Management
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            Create Short URL
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Shorten long URLs and track analytics easily.
          </p>

          {/* USER */}
          <p className="text-sm text-gray-500 mt-2">
            Logged in as{" "}
            <span className="text-purple-400">{user?.fName || "User"}</span>
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 md:p-10"
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              {/* ORIGINAL URL */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  Original URL
                </label>

                <input
                  type="text"
                  name="originalUrl"
                  placeholder="https://example.com"
                  value={urlData.originalUrl}
                  onChange={handleChange}
                  required
                  className="w-full h-14 px-5 rounded-2xl bg-[#111827] border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* CUSTOM ALIAS */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  Custom Alias
                </label>

                <input
                  type="text"
                  name="customAlias"
                  placeholder="my-custom-link"
                  value={urlData.customAlias}
                  onChange={handleChange}
                  className="w-full h-14 px-5 rounded-2xl bg-[#111827] border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* PURPOSE */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  Purpose
                </label>

                <select
                  name="purpose"
                  value={urlData.purpose}
                  onChange={handleChange}
                  className="w-full h-14 px-5 rounded-2xl bg-[#111827] border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
                >
                  <option value="General">General</option>

                  <option value="Resume">Resume</option>

                  <option value="Project">Project</option>

                  <option value="Event">Event</option>
                </select>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {/* PRIVACY */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  Privacy
                </label>

                <select
                  name="privacy"
                  value={urlData.privacy}
                  onChange={handleChange}
                  className="w-full h-14 px-5 rounded-2xl bg-[#111827] border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
                >
                  <option value="Public">Public</option>

                  <option value="Private">Private</option>
                </select>
              </div>

              {/* EXPIRY TYPE */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  Expiry Type
                </label>

                <select
                  name="expiryType"
                  value={urlData.expiryType}
                  onChange={handleChange}
                  className="w-full h-14 px-5 rounded-2xl bg-[#111827] border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
                >
                  <option value="">No Expiry</option>

                  <option value="hours">Hours</option>

                  <option value="days">Days</option>

                  <option value="date">Date</option>
                </select>
              </div>

              {/* EXPIRY VALUE */}
              {urlData.expiryType && (
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-300">
                    Expiry Value
                  </label>

                  <input
                    type={urlData.expiryType === "date" ? "date" : "number"}
                    name="expiryValue"
                    value={urlData.expiryValue}
                    onChange={handleChange}
                    className="w-full h-14 px-5 rounded-2xl bg-[#111827] border border-white/10 outline-none focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              )}

              {/* QR */}
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Generate QR Code</h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Create QR instantly for sharing
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="qrEnabled"
                  checked={urlData.qrEnabled}
                  onChange={handleChange}
                  className="w-5 h-5 accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-lg hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Short URL"}
          </button>
        </form>

        {/* RESULT */}
        {result && (
          <div className="mt-10 bg-white/[0.04] border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold text-green-400">
                  URL Created Successfully
                </h2>

                <p className="text-gray-400 mt-2">
                  Your shortened URL is ready
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                Success
              </div>
            </div>

            {/* SHORT URL */}
            <div className="mt-8">
              <p className="text-sm text-gray-400 mb-3">Short URL</p>

              <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 break-all text-lg"
                >
                  {result.shortUrl}
                </a>

                <button
                  onClick={() => navigator.clipboard.writeText(result.shortUrl)}
                  className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition-all duration-300"
                >
                  Copy URL
                </button>
              </div>
            </div>

            {/* QR */}
            {result.qrCode && (
              <div className="mt-8">
                <p className="text-sm text-gray-400 mb-4">QR Code</p>

                <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 inline-block">
                  <img
                    src={result.qrCode}
                    alt="QR Code"
                    className="w-56 rounded-2xl"
                  />
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-medium"
              >
                Go To Dashboard
              </Link>

              <button
                onClick={() => setResult(null)}
                className="px-7 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateUrl;
