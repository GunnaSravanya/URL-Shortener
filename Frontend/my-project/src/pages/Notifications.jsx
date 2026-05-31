import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await axios.get(
        "https://url-shortener-tu9a.onrender.com/urlApi/notifications",
        {
          withCredentials: true,
        },
      );

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-8">
      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Notifications
          <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
            {" "}
            Center
          </span>
        </h1>

        <p className="text-gray-400 mt-2">
          Stay updated with your latest account activities
        </p>
      </div>

      {/* USER INFO */}

      <div className="mb-8 bg-white/5 border border-white/10 rounded-3xl p-6">
        <p className="text-gray-400 text-sm">Logged in as</p>

        <h2 className="text-xl font-semibold mt-1">
          {authUser?.fName || "User"}
        </h2>

        <p className="text-gray-500 text-sm mt-1">{authUser?.email}</p>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="text-gray-400 text-lg">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-300">
            No Notifications
          </h2>

          <p className="text-gray-500 mt-3">You're all caught up for now.</p>
        </div>
      ) : (
        /* NOTIFICATION LIST */
        <div className="space-y-5">
          {notifications.map((note, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* TITLE */}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" />

                    <h3 className="text-lg font-semibold text-white">
                      Notification
                    </h3>
                  </div>

                  {/* MESSAGE */}

                  <p className="text-gray-300 leading-relaxed">
                    {note.message}
                  </p>

                  {/* DATE */}

                  <p className="text-gray-500 text-sm mt-4">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
