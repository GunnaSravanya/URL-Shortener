import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UserDetails() {
  /* ================= PARAMS ================= */

  const { id } = useParams();

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [urls, setUrls] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ================= FETCH URLS ================= */

  useEffect(() => {
    fetchUrls();
  }, []);

  async function fetchUrls() {
    try {
      setLoading(true);

      const res = await axios.get(`http://localhost:4000/adminApi/user/${id}`, {
        withCredentials: true,
      });

      setUrls(res.data.urls || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  }

  /* ================= DELETE URL ================= */

  async function handleDelete(urlId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this URL?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/adminApi/url/${urlId}`, {
        withCredentials: true,
      });

      setUrls((prev) => prev.filter((url) => url.id !== urlId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete URL");
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-8">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">User URLs</h1>

          <p className="text-gray-400 mt-2">
            Manage all URLs created by this user
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
        >
          Back
        </button>
      </div>

      {/* LOADING */}

      {loading && <div className="text-gray-400 text-lg">Loading URLs...</div>}

      {/* ERROR */}

      {error && <div className="text-red-400 text-lg">{error}</div>}

      {/* TABLE */}

      {!loading && !error && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 min-w-[900px]">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left px-4 font-medium">Original URL</th>

                <th className="text-left px-4 font-medium">Short Code</th>

                <th className="text-left px-4 font-medium">Clicks</th>

                <th className="text-left px-4 font-medium">Privacy</th>

                <th className="text-left px-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {urls.map((url) => (
                <tr
                  key={url.id}
                  className="bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
                >
                  {/* ORIGINAL URL */}

                  <td className="px-4 py-5 rounded-l-2xl text-gray-300 break-all">
                    {url.originalUrl}
                  </td>

                  {/* SHORT CODE */}

                  <td className="px-4 py-5">
                    <span className="text-blue-400 font-medium">
                      {url.shortCode}
                    </span>
                  </td>

                  {/* CLICKS */}

                  <td className="px-4 py-5">
                    <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {url.clicks}
                    </span>
                  </td>

                  {/* PRIVACY */}

                  <td className="px-4 py-5">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs border ${
                        url.privacy === "Public"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {url.privacy}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td className="px-4 py-5 rounded-r-2xl">
                    <button
                      onClick={() => handleDelete(url.id)}
                      className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {/* EMPTY */}

              {urls.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No URLs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
