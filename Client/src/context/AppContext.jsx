import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../configs/axios";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH USER
  ========================= */
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    // No token → not logged in
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/api/user/profile");

      if (data?.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Failed to fetch user:",
        error.response?.data || error.message
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOGIN
  ========================= */
  const login = async (token) => {
    localStorage.setItem("token", token);

    setLoading(true); // 🔥 prevents premature redirects
    await fetchUser(); // 🔥 instantly updates user
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    fetchUser();
  }, []);





  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/api/project/projects");
        if (data.success) setProjects(data.projects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  /* =========================
     CONTEXT VALUE
  ========================= */
  const value = {
    user,
    loading,
    fetchUser,
    login,
    logout,
    projects,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext };