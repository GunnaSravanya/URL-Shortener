import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute({ children, role }) {
  /* ================= AUTH STORE ================= */

  const { user, isAuthenticated } = useAuthStore();

  /* ================= NOT LOGGED IN ================= */

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /* ================= ROLE CHECK ================= */

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  /* ================= ALLOW ACCESS ================= */

  return children;
}

export default ProtectedRoute;
