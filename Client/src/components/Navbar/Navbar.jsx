import React, { useState, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import "./Navbar.css";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAppContext();

  const navigate = useNavigate();

  /* =========================
     PREVENT SCROLL
  ========================= */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [mobileMenuOpen]);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    logout(); // ✅ centralised

    navigate("/", {
      replace: true,
    });

    setMobileMenuOpen(false); // ✅ close mobile menu
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        
        {/* LOGO */}
        <div
          className="navbar-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/logo.png"
            alt="Whitehilll Logo"
            className="navbar-logo-img"
          />
          <span className="navbar-title">WHITEHILLL</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="desktop-nav">
          <DesktopNav
            handleLogout={handleLogout}
            navLinks={navLinks}
          />
        </div>

        {/* MOBILE NAV */}
        <div className="mobile-nav">
          <MobileNav
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            handleLogout={handleLogout}
            navLinks={navLinks}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;