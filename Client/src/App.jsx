import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Register from "./pages/Onboard/Register/Register";
import KYC from "./pages/Onboard/KYC/KYC";
import Login from "./pages/Onboard/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile/Profile";

const App = () => {
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div>
      <Navbar />
      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/update-kyc" element={<KYC />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
