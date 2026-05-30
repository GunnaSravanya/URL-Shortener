import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditUrl() {
  /* ================= ROUTER ================= */

  const { id } = useParams();

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [urlData, setUrlData] = useState({
    updatedOriginalUrl: "",
    updatedCustomAlias: "",
    updatedPurpose: "General",
    updatedMaxClicks: "",
    updatedPrivacy: "Public",
    updatedQrEnabled: false,
    updatedExpiresAt: "",
  });

  /* ================= FETCH URL DETAILS ================= */

  useEffect(() => {
    async function fetchUrlDetails() {
      try {
        const res = await axios.get(
          `http://localhost:4000/urlApi/particularUrl/${id}`,
          {
            withCredentials: true,
          },
        );

        const url = res.data.url;

        setUrlData({
          updatedOriginalUrl: url.originalUrl || "",
          updatedCustomAlias: url.customAlias || "",
          updatedPurpose: url.purpose || "General",
          updatedMaxClicks: url.maxClicks || "",
          updatedPrivacy: url.privacy || "Public",
          updatedQrEnabled: url.qrEnabled || false,
          updatedExpiresAt: url.expiresAt
            ? new Date(url.expiresAt).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load URL");
      } finally {
        setLoading(false);
      }
    }

    fetchUrlDetails();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setUrlData({
      ...urlData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  /* ================= HANDLE UPDATE ================= */

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setUpdating(true);

      setError("");

      setSuccess("");

      await axios.put(
        `http://localhost:4000/urlApi/urldetails/${id}`,
        urlData,
        {
          withCredentials: true,
        },
      );

      setSuccess("URL updated successfully");

      setTimeout(() => {
        navigate("/dashboard/myurls");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        <h1 className="text-2xl text-gray-400">Loading URL details...</h1>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold">Edit URL</h1>

          <p className="text-gray-400 mt-2">
            Update your shortened URL settings
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-[#111827] border border-gray-800 rounded-3xl p-8 space-y-7"
        >
          {/* ORIGINAL URL */}

          <div>
            <label className="block mb-3 text-gray-300 font-medium">
              Original URL
            </label>

            <input
              type="text"
              name="updatedOriginalUrl"
              value={urlData.updatedOriginalUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full bg-[#0B0F1A] border border-gray-700 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* CUSTOM ALIAS */}

          <div>
            <label className="block mb-3 text-gray-300 font-medium">
              Custom Alias
            </label>

            <input
              type="text"
              name="updatedCustomAlias"
              value={urlData.updatedCustomAlias}
              onChange={handleChange}
              placeholder="custom-alias"
              className="w-full bg-[#0B0F1A] border border-gray-700 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* PURPOSE */}

          <div>
            <label className="block mb-3 text-gray-300 font-medium">
              Purpose
            </label>

            <select
              name="updatedPurpose"
              value={urlData.updatedPurpose}
              onChange={handleChange}
              className="w-full bg-[#0B0F1A] border border-gray-700 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all"
            >
              <option value="General">General</option>

              <option value="Resume">Resume</option>

              <option value="Project">Project</option>

              <option value="Event">Event</option>
            </select>
          </div>

          {/* MAX CLICKS */}

          <div>
            <label className="block mb-3 text-gray-300 font-medium">
              Maximum Clicks
            </label>

            <input
              type="number"
              name="updatedMaxClicks"
              value={urlData.updatedMaxClicks}
              onChange={handleChange}
              placeholder="100"
              className="w-full bg-[#0B0F1A] border border-gray-700 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* PRIVACY */}

          <div>
            <label className="block mb-3 text-gray-300 font-medium">
              Privacy
            </label>

            <select
              name="updatedPrivacy"
              value={urlData.updatedPrivacy}
              onChange={handleChange}
              className="w-full bg-[#0B0F1A] border border-gray-700 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all"
            >
              <option value="Public">Public</option>

              <option value="Private">Private</option>
            </select>
          </div>

          {/* EXPIRY */}

          <div>
            <label className="block mb-3 text-gray-300 font-medium">
              Expiry Date
            </label>

            <input
              type="date"
              name="updatedExpiresAt"
              value={urlData.updatedExpiresAt}
              onChange={handleChange}
              className="w-full bg-[#0B0F1A] border border-gray-700 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* QR ENABLE */}

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              name="updatedQrEnabled"
              checked={urlData.updatedQrEnabled}
              onChange={handleChange}
              className="w-5 h-5 accent-indigo-500"
            />

            <label className="text-gray-300">Enable QR Code Generation</label>
          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-4">
              {success}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="submit"
              disabled={updating}
              className="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 font-semibold"
            >
              {updating ? "Updating..." : "Update URL"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/myurls")}
              className="px-8 py-4 rounded-2xl bg-[#1A2235] border border-gray-700 hover:bg-[#222C44] transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUrl;
