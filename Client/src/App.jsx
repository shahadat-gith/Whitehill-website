import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Register from "./pages/Onboard/Register/Register";
import KYC from "./pages/Onboard/KYC/KYC";
import Login from "./pages/Onboard/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import ProtectedRoute from "./Utils/ProtectedRoute";
import RestrictedRoute from "./Utils/RestrictedRoute";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Navbar />
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Block logged-in users from accessing /login or /resgiter */}
        <Route
          path="/register"
          element={
            <RestrictedRoute>
              <Register />
            </RestrictedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <RestrictedRoute>
              <Login />
            </RestrictedRoute>
          }
        />

        {/* Protect KYC route */}
        <Route
          path="/kyc"
          element={
            <ProtectedRoute>
              <KYC />
            </ProtectedRoute>
          }
        />

        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
