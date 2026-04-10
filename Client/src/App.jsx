import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import GuestRoute from "./components/GuestRoute/GuestRoute";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import NotFound from "./components/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile/Profile";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import Investment from "./pages/Investment/Investment";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Funding from "./pages/Funding/Funding";
import Authentication from "./pages/Authentication/Authentication";
import UserFundingRequests from "./pages/UserFundingRequests/UserFundingRequests";



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
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* 🚫 Guest Only */}
          <Route
            path="/auth"
            element={
              <GuestRoute>
                <Authentication />
              </GuestRoute>
            }
          />

          {/* 🔐 Protected */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/investments/:userId"
            element={
              <ProtectedRoute>
                <Investment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/funding"
            element={
              <ProtectedRoute>
                <Funding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/funding/:userId"
            element={
              <ProtectedRoute>
                <UserFundingRequests />
              </ProtectedRoute>
            }
          />




          {/* Public */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
