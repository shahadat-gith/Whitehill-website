import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  /* =========================
     THEME STATE
  ========================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const navigate = useNavigate();

  /* =========================
     TOKEN PERSISTENCE
  ========================= */
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /* =========================
     THEME EFFECT
  ========================= */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* =========================
     TOGGLE THEME
  ========================= */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = {
    backendUrl,
    token,
    setToken,
    navigate,

    // theme
    theme,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
