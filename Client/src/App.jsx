import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Register from "./pages/Onboard/Register/Register";
import Login from "./pages/Onboard/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile/Profile";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import Investment from "./pages/Investment/Investment";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import FundRequest from "./pages/FundRequest/FundRequest";
import Congratulations from "./pages/FundRequest/Congratulations";
import SellProperty from "./pages/SellProperty/SellProperty";
import SellPropertyUploads from "./pages/SellProperty/SellPropertyUploads";
import SellPropertyReview from "./pages/SellProperty/SellPropertyReview";
import SellPropertyCongratulations from "./pages/SellProperty/SellPropertyCongratulations";

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

        <Route path="/profile" element={<Profile />} />
        <Route path="/investment-profile" element={<Investment />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sell-property" element={<SellProperty />} />
        <Route path="/sell-property/review" element={<SellPropertyReview />} />
        <Route path="/sell-property/congratulations" element={<SellPropertyCongratulations />} />
        <Route path="/sell-property/uploads/:id" element={<SellPropertyUploads />} />
        <Route path="/request-funds" element={<FundRequest />} />
        <Route path="/congratulations" element={<Congratulations />} />
        
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
