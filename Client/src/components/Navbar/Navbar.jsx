import React, { useState, useEffect } from "react";
import "./Navbar.css";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import axios from "axios";
import api from "../../Configs/axios";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setUser } = useAppContext()

  const navigate = useNavigate()

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [mobileMenuOpen]);


  const handleLogout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", {
      replace: true,
      state: null,
    });

  }

  const navLinks = [
    {label: "Home", to:"/"},
    {label: "Projects", to:"/projects"},
    {label: "Fund Request", to:"/fund-request"},
    {label: "About", to:"/about"},
    {label: "Contact", to:"/contact"},
  ]

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* LOGO */}
        <div className="navbar-logo">
          <img src="/logo.png" alt="Whitehilll Logo" className="navbar-logo-img" />
          <span className="navbar-title">WHITEHILLL</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="desktop-nav">
          <DesktopNav
            handleLogout={handleLogout}
            navLinks = {navLinks}
          />
        </div>

        {/* MOBILE NAV */}
        <div className="mobile-nav">
          <MobileNav
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            handleLogout={handleLogout}
            navLinks = {navLinks}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
