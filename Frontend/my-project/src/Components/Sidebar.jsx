import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import useAuthStore from "../store/authStore";

function Sidebar() {
  const location = useLocation();

  const navigate = useNavigate();

  //zustand auth store
  const { logout } = useAuthStore();

  //logout function
  async function handleLogout() {
    try {
      await logout();

      //redirect
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  //sidebar links
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },

    {
      name: "Create URL",
      path: "/dashboard/createurl",
    },

    {
      name: "My URLs",
      path: "/dashboard/myurls",
    },

    {
      name: "Trash",
      path: "/dashboard/trash",
    },

    {
      name: "Notifications",
      path: "/dashboard/notifications",
      icon: (
        <Bell
          size={18}
          className="text-amber-400 fill-amber-400 stroke-[1.8]"
        />
      ),
    },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-[#111827] border-r border-white/10 flex flex-col p-6">
      {/* Logo */}

      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        GetShortify
      </h1>

      {/* Navigation Links */}

      <div className="mt-12 flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-5 py-4 rounded-2xl transition-all duration-300

      ${
        location.pathname === link.path
          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
      }
    `}
          >
            <div className="flex items-center gap-3">
              {link.icon}

              <span>{link.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Logout */}

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full px-5 py-4 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
