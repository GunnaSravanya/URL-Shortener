import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageUsers() {
  /* ================= NAVIGATION ================= */

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(searchValue = "") {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://url-shortener-tu9a.onrender.com/adminApi/searchusers?search=${searchValue}`,
        {
          withCredentials: true,
        },
      );

      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SEARCH ================= */

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* ================= BLOCK / UNBLOCK ================= */

  async function handleStatus(user) {
    try {
      await axios.patch(
        "https://url-shortener-tu9a.onrender.com/adminApi/userstatus",
        {
          userId: user.id,
          email: user.email,
          status: !user.isActive,
        },
        { withCredentials: true },
      );

      await fetchUsers(search);
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to update status");
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-8">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>

          <p className="text-gray-400 mt-2">
            View and manage all registered users
          </p>
        </div>

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none w-full lg:w-96 text-white placeholder:text-gray-500"
        />
      </div>

      {/* ================= LOADING ================= */}

      {loading && <div className="text-gray-400 text-lg">Loading users...</div>}

      {/* ================= ERROR ================= */}

      {error && <div className="text-red-400 text-lg">{error}</div>}

      {/* ================= USERS TABLE ================= */}

      {!loading && !error && (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-7 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 min-w-[900px]">
            {/* TABLE HEADER */}

            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left font-medium px-4">Name</th>

                <th className="text-left font-medium px-4">Email</th>

                <th className="text-left font-medium px-4">Total URLs</th>

                <th className="text-left font-medium px-4">Status</th>

                <th className="text-left font-medium px-4">Actions</th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300"
                >
                  {/* NAME */}

                  <td className="px-4 py-5 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />

                      <span className="text-white font-medium">
                        {user.fName}
                      </span>
                    </div>
                  </td>

                  {/* EMAIL */}

                  <td className="px-4 py-5 text-gray-300">{user.email}</td>

                  {/* URL COUNT */}

                  <td className="px-4 py-5">
                    <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {user.totalUrls}
                    </span>
                  </td>

                  {/* STATUS */}

                  <td className="px-4 py-5">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs border ${
                        user.isActive
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {user.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td className="px-4 py-5 rounded-r-2xl">
                    <div className="flex items-center gap-3">
                      {/* VIEW */}

                      <button
                        onClick={() =>
                          navigate(`/admindashboard/user/${user.id}`)
                        }
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-sm font-medium"
                      >
                        View
                      </button>

                      {/* BLOCK / UNBLOCK */}

                      <button
                        onClick={() => handleStatus(user)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                          user.isActive
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.isActive ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* EMPTY STATE */}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No users found
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

export default ManageUsers;
