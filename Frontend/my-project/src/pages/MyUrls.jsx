import { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLink, Copy, Trash2, Pencil, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function Popup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111827] p-6 rounded-2xl border border-gray-700 w-[300px]">
        <p className="text-white mb-4">{message}</p>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-indigo-500 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function MyUrls() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const { user } = useAuthStore();

  async function fetchUrls() {
    try {
      const res = await axios.get("http://localhost:4000/urlApi/allurls", {
        withCredentials: true,
      });

      setUrls(res.data.url || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUrls();
  }, []);

  async function handleCopy(url) {
    try {
      await navigator.clipboard.writeText(url);

      setPopupMessage("URL copied successfully");
      setShowPopup(true);
    } catch (err) {
      setPopupMessage("Failed to copy URL");
      setShowPopup(true);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.patch(
        `http://localhost:4000/urlApi/softdelete/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      setUrls((prev) => prev.filter((u) => u.id !== id));

      setPopupMessage("URL moved to trash successfully");
      setShowPopup(true);
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Failed to delete URL");

      setShowPopup(true);
    }
  }

  function handleAnalytics(id) {
    navigate(`/dashboard/analytics/${id}`);
  }

  function handleEdit(id) {
    navigate(`/dashboard/edit/${id}`);
  }

  async function handleRedirectCheck(shortCode) {
    try {
      const res = await axios.get(
        `http://localhost:4000/urlApi/check/${shortCode}`,
        {
          withCredentials: true,
        },
      );

      if (!res.data || res.data.status !== "ok") {
        setPopupMessage(res.data?.message || "Link not available");

        setShowPopup(true);

        return;
      }

      window.open(`http://localhost:4000/urlApi/${shortCode}`, "_blank");
      await fetchUrls(); 
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error occurred");

      setShowPopup(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* ================= POPUP ================= */}

      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}

      {/* ================= HEADER ================= */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold">My URLs</h1>

        <p className="text-gray-400 mt-2">Manage all your shortened URLs</p>

        <div className="mt-4 text-sm text-gray-500">
          Logged in as{" "}
          <span className="text-indigo-400 font-medium">
            {user?.fName || "User"}
          </span>
        </div>
      </div>

      {/* ================= LOADING ================= */}

      {loading && <div className="text-gray-400">Loading URLs...</div>}

      {/* ================= ERROR ================= */}

      {error && <div className="text-red-400">{error}</div>}

      {/* ================= EMPTY STATE ================= */}

      {!loading && !error && urls.length === 0 && (
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-10 text-center">
          No URLs Found
        </div>
      )}

      {/* ================= URL LIST ================= */}

      {!loading && !error && urls.length > 0 && (
        <div className="space-y-6">
          {urls.map((url) => (
            <div
              key={url.id}
              className="bg-[#111827] border border-gray-800 rounded-3xl p-7"
            >
              <div className="flex justify-between gap-6 flex-col lg:flex-row">
                {/* ================= URL DETAILS ================= */}

                <div className="flex-1">
                  <div>
                    <p className="text-gray-400 text-sm">Short URL</p>

                    <p className="text-indigo-400 break-all">{url.shortUrl}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-400 text-sm">Original URL</p>

                    <p className="text-gray-300 break-all">{url.originalUrl}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="px-3 py-1 rounded-xl bg-white/5 text-sm border border-white/10">
                      {url.privacy}
                    </span>

                    {url.qrEnabled && (
                      <span className="px-3 py-1 rounded-xl bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                        QR Enabled
                      </span>
                    )}
                  </div>
                </div>

                {/* ================= CLICKS ================= */}

                <div className="min-w-[120px]">
                  <p className="text-gray-400 text-sm">Clicks</p>

                  <p className="text-2xl font-bold">{url.clicks || 0}</p>
                </div>
              </div>

              {/* ================= ACTION BUTTONS ================= */}

              <div className="flex flex-wrap gap-4 mt-6">
                {/* SMART REDIRECT */}

                <button
                  onClick={() =>
                    handleRedirectCheck(url.shortUrl.split("/").pop())
                  }
                  className="flex items-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 rounded-2xl"
                >
                  <ExternalLink size={18} />
                  Smart Redirect
                </button>

                {/* COPY */}

                <button
                  onClick={() => handleCopy(url.shortUrl)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#1A2235] hover:bg-[#25304b] transition-all duration-300 rounded-2xl"
                >
                  <Copy size={18} />
                  Copy
                </button>

                {/* EDIT */}

                <button
                  onClick={() => handleEdit(url.id)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#1A2235] hover:bg-[#25304b] transition-all duration-300 rounded-2xl"
                >
                  <Pencil size={18} />
                  Edit
                </button>

                {/* ANALYTICS */}

                <button
                  onClick={() => handleAnalytics(url.id)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#1A2235] hover:bg-[#25304b] transition-all duration-300 rounded-2xl"
                >
                  <BarChart3 size={18} />
                  Analytics
                </button>

                {/* DELETE */}

                <button
                  onClick={() => handleDelete(url.id)}
                  className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-300 rounded-2xl"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyUrls;
