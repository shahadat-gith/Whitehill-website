import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Demo user (replace later with real auth)
  const user = {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/40",
    loggedIn: true,
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* LOGO */}
        <div className="navbar-logo">
          <img src="/logo.png" alt="Whitehilll Logo" className="navbar-logo-img" />
          <span className="navbar-title">WHITEHILLL</span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/investment" className="nav-link">Investment</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* DESKTOP RIGHT SECTION */}
        <div className="navbar-right" ref={dropdownRef}>
          {user && user.loggedIn ? (
            <div className="navbar-user">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="user-btn"
              >
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
                <i
                  className={`fa-solid fa-chevron-down user-arrow ${
                    dropdownOpen ? "rotate" : ""
                  }`}
                ></i>
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fa-solid fa-user"></i> Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                  <button
                    onClick={() => alert("Logging out...")}
                    className="dropdown-item logout"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn btn-primary">Create Account</button>
              <button className="btn btn-secondary">Login</button>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER/CLOSE BUTTON */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <i className="fa-solid fa-xmark"></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Nav Links */}
          <div className="mobile-nav-links">
            <Link 
              to="/" 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/investment" 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Investment
            </Link>
            <Link 
              to="/about" 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Auth/User Section */}
          {user && user.loggedIn ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <img src={user.avatar} alt={user.name} className="mobile-user-avatar" />
                <span className="mobile-user-name">{user.name}</span>
              </div>
              <div className="mobile-user-links">
                <Link 
                  to="/profile" 
                  className="mobile-dropdown-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-user"></i> Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="mobile-dropdown-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-gear"></i> Settings
                </Link>
                <button
                  onClick={() => {
                    alert("Logging out...");
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-dropdown-item logout"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </button>
              <button 
                className="btn btn-secondary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;