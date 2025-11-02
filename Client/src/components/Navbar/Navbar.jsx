import React, { useState, useEffect } from "react";
import "./Navbar.css";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [mobileMenuOpen]);

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
          <DesktopNav />
        </div>

        {/* MOBILE NAV */}
        <div className="mobile-nav">
          <MobileNav 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
