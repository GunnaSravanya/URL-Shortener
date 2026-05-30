import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";

/* Public Pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* User Pages */
import Dashboard from "./pages/Dashboard";
import MyUrls from "./pages/MyUrls";
import CreateUrl from "./pages/CreateUrl";
import Trash from "./pages/Trash";
import Analytics from "./pages/Analytics";
import EditUrl from "./pages/EditUrl";
import Notifications from "./pages/Notifications";

/* Admin Pages */
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import UserDetails from "./pages/UserDetails";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================= USER DASHBOARD ROUTES ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="User">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="createurl" element={<CreateUrl />} />

          <Route path="notifications" element={<Notifications />} />

          <Route path="myurls" element={<MyUrls />} />

          <Route path="trash" element={<Trash />} />

          <Route path="edit/:id" element={<EditUrl />} />

          <Route path="analytics/:id" element={<Analytics />} />
        </Route>
        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* /admindashboard/users */}
          <Route path="users" element={<ManageUsers />} />

          {/* /admindashboard/user/123 */}
          <Route path="user/:id" element={<UserDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
