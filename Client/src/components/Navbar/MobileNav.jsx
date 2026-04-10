import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Spinner from "../Spinner/Spinner";
import "./MobileNav.css"

const MobileNav = ({ mobileMenuOpen, setMobileMenuOpen, loggingout, handleLogout, navLinks }) => {
  const { user, loading } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="mn-container">
      <div className="mn-bar-actions" ref={dropdownRef}>
        {!loading && user && user.fullName && (
          <div className="mn-user-wrapper">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="mn-avatar-btn">
              <img src={user.image?.url || "/user.png"} alt="User" />
            </button>
            {dropdownOpen && (
              <div className="mn-avatar-dropdown">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                <button onClick={() => { handleLogout(); setDropdownOpen(false); }}>Logout</button>
              </div>
            )}
          </div>
        )}

        <button 
          className={`mn-hamburger ${mobileMenuOpen ? "active" : ""}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* DRAWER (Starts below navbar) */}
      <div className={`mn-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mn-drawer-inner">
          <nav className="mn-nav-list">
            {navLinks.map((item, index) => (
              <Link key={index} to={item.to} className="mn-nav-item" onClick={closeMenu}>
                <span className="mn-nav-label">{item.label}</span>
                <i className="fas fa-chevron-right mn-nav-arrow"></i>
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="mn-auth-footer">
              <button className="btn btn-primary mn-full-btn" onClick={() => { navigate("/auth"); closeMenu(); }}>
                Create Account
              </button>
              <button className="btn btn-secondary mn-full-btn" onClick={() => { navigate("/auth"); closeMenu(); }}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;