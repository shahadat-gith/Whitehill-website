import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../Configs/axios";
import axios from "axios";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  

  // Fetch user only if cookie (token) exists
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/user/profile"); 
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUser on mount if cookie present
  useEffect(() => {
   fetchUser()
  }, []);

  const value = {
    user,
    setUser,
    loading,
    fetchUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext };
