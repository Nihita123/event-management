// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/axiosInstance"; // your pre‑configured Axios

/* ------------------------------------------------------------------ */
/*  Context setup                                                     */
/* ------------------------------------------------------------------ */
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  /* ───────────────────────────── STATE ───────────────────────────── */
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("authUser")) || null
  );
  const [loading, setLoading] = useState(false);

  /* ──────────────────────── HELPERS / SIDE‑EFFECTS ────────────────── */
  /** Write token to storage + axios default */
  const persistToken = useCallback((jwt) => {
    if (!jwt) return;
    localStorage.setItem("authToken", jwt);
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    setToken(jwt);
  }, []);

  /** Fetch the logged‑in user from backend and cache it */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/auth/me"); // <- add this route as shown earlier
      localStorage.setItem("authUser", JSON.stringify(data));
      setUser(data);
    } catch (err) {
      console.error("Unable to fetch user:", err);
      logout(); // token no longer valid
    }
  }, []);

  /** Initialise axios default header if token already in storage */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (!user) fetchCurrentUser(); // e.g. came from Google OAuth
    }
  }, [token, user, fetchCurrentUser]);

  /* ─────────────────────────── API CALLS ─────────────────────────── */
  // 🔐 Email/password login
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      persistToken(data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ✍️ Register
  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      persistToken(data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // 👋 Google (or any OAuth) callback helper
  // Call this from `/oauth-success`
  const setUserFromToken = (jwt) => {
    persistToken(jwt);
    fetchCurrentUser(); // Hydrate user info from backend using token
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  /* ────────────────────────── PROVIDER VAL ───────────────────────── */
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    setUserFromToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
