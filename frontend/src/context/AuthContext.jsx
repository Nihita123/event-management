import { createContext, useContext, useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("authUser")) || null
  );
  const [loading, setLoading] = useState(false);

  // 🔐 Login
  const login = async ({ email, password }) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("authUser", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ✍️ Register
  const register = async ({ name, email, password, role }) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("authUser", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
