// frontend/src/context/AuthContext.jsx
import React, { useEffect, useState, createContext } from "react";
import axios from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("sjd_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("sjd_token") || null);
  const [loading, setLoading] = useState(true);

  // 🔹 Attach token globally
  useEffect(() => {
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  // 🔹 Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get("/auth/profile");
        setUser(data);
        localStorage.setItem("sjd_user", JSON.stringify(data));
      } catch (err) {
        console.error("User fetch failed:", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // 🔹 Login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", credentials);
      setToken(data.token);
      localStorage.setItem("sjd_token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      const profile = await axios.get("/auth/profile");
      setUser(profile.data);
      localStorage.setItem("sjd_user", JSON.stringify(profile.data));

      return profile.data;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Register
  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register", payload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sjd_token");
    localStorage.removeItem("sjd_user");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  // 🔹 Refresh user manually
  const refreshUser = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/auth/profile");
      setUser(data);
      localStorage.setItem("sjd_user", JSON.stringify(data));
    } catch (err) {
      console.error("User refresh failed:", err);
    }
  };

  // 🔹 Auto logout after 1h inactivity
  useEffect(() => {
    if (!token) return;
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => logout(), 60 * 60 * 1000);
    };
    ["mousemove", "keydown", "click"].forEach((e) =>
      window.addEventListener(e, resetTimer)
    );
    resetTimer();
    return () => {
      ["mousemove", "keydown", "click"].forEach((e) =>
        window.removeEventListener(e, resetTimer)
      );
      clearTimeout(timeout);
    };
  }, [token]);

  // 🔹 Auto logout if 401 response
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        refreshUser,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
