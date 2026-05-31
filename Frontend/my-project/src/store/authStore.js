import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  /* ================= STATES ================= */

  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  /* ================= LOGIN ================= */

  login: async (email, password) => {
    try {
      const res = await axios.post(
        "https://url-shortener-tu9a.onrender.com/commonApi/login",
        { email, password },
        { withCredentials: true },
      );

      const user = res.data.user;

      // store in zustand
      set({
        user,
        isAuthenticated: true,
      });

      // optional persistence (for refresh fallback)
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  },

  /* ================= LOGOUT ================= */

  logout: async () => {
    try {
      await axios.get("https://url-shortener-tu9a.onrender.com/commonApi/logout", {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });

      localStorage.removeItem("user");
    }
  },

  /* ================= CHECK AUTH ================= */

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const res = await axios.get(
        "https://url-shortener-tu9a.onrender.com/commonApi/check-auth",
        { withCredentials: true },
      );

      const user = res.data.user;

      set({
        user,
        isAuthenticated: true,
      });

      // sync localStorage
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      // 401 is normal (not logged in)
      set({
        user: null,
        isAuthenticated: false,
      });

      localStorage.removeItem("user");
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;
