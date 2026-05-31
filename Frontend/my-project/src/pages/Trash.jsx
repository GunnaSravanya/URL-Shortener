import { useEffect, useState } from "react";
import axios from "axios";

function Trash() {
  /* ================= STATES ================= */

  const [trashUrls, setTrashUrls] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ================= FETCH TRASH URLS ================= */

  useEffect(() => {
    async function fetchTrashUrls() {
      try {
        const res = await axios.get("https://url-shortener-tu9a.onrender.com/urlApi/trash", {
          withCredentials: true,
        });

        setTrashUrls(res.data.urls || []);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchTrashUrls();
  }, []);

  /* ================= RESTORE URL ================= */

  async function handleRestore(id) {
    try {
      await axios.patch(
        `https://url-shortener-tu9a.onrender.com/urlApi/restore/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      setTrashUrls(trashUrls.filter((url) => url.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Restore failed");
    }
  }

  /* ================= DELETE PERMANENT ================= */

  async function handlePermanentDelete(id) {
    try {
      await axios.delete(`https://url-shortener-tu9a.onrender.com/urlApi/permanent/${id}`, {
        withCredentials: true,
      });

      setTrashUrls(trashUrls.filter((url) => url.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Permanent delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* HEADER */}
      <div className="mb-10">
        <div className="inline-flex items-center px-4 py-1.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-5">
          Trash Management
        </div>

        <h1 className="text-5xl font-bold tracking-tight">Trash Bin</h1>

        <p className="text-gray-400 mt-3 text-lg">
          Restore deleted URLs or remove them permanently.
        </p>
      </div>

      {/* LOADING */}
      {loading && <div className="text-gray-400 text-lg">Loading trash...</div>}

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && trashUrls.length === 0 && (
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-semibold text-white">Trash is Empty</h2>

          <p className="text-gray-400 mt-3">Deleted URLs will appear here.</p>
        </div>
      )}

      {/* URLS */}
      {!loading && !error && trashUrls.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {trashUrls.map((url, index) => (
            <div
              key={index}
              className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 backdrop-blur-lg hover:bg-white/[0.06] transition-all duration-300"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-5 flex-wrap">
                <div className="flex-1">
                  {/* SHORT CODE */}
                  <div className="inline-flex items-center px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-4">
                    {url.shortCode}
                  </div>

                  {/* ORIGINAL URL */}
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-lg text-blue-400 break-all hover:text-blue-300 transition-all duration-300"
                  >
                    {url.originalUrl}
                  </a>

                  {/* PURPOSE */}
                  <div className="mt-4">
                    <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm">
                      {url.purpose}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                  {/* RESTORE */}
                  <button
                    onClick={() => handleRestore(url.id)}
                    className="px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all duration-300"
                  >
                    Restore
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handlePermanentDelete(url.id)}
                    className="px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trash;
