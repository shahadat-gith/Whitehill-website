import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import Spinner from "../Spinner/Spinner";

const MobileNav = ({ mobileMenuOpen, setMobileMenuOpen, loggingout, handleLogout }) => {
    const { user, loading } = useAppContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="navbar-mobile">
            <div className="navbar-mobile-actions" ref={dropdownRef}>
                {loading ? (
                    <Spinner size="small" color="primary" />
                ) : user && user.fullName ? (
                    <div className="navbar-user-mobile">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-btn-mobile">
                            <img src={user.image || "/user.png"} alt={user.fullName} className="user-avatar-mobile" />
                            <i className={`fa-solid fa-chevron-down user-arrow-mobile ${dropdownOpen ? "rotate" : ""}`}></i>
                        </button>

                        {dropdownOpen && (
                            <div className="dropdown-menu-mobile">
                                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-user"></i> Profile
                                </Link>
                                <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-gear"></i> Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setDropdownOpen(false);
                                    }}
                                    className="dropdown-item logout"
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i> {loggingout ? "logging out..." : "Logout"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>
                        Login
                    </button>
                )}

                {/* HAMBURGER BUTTON */}
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

            {/* Overlay Menu */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? "open" : ""}`}>
                <div className="mobile-menu-content">
                    <div className="mobile-nav-links">
                        <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </Link>
                        <Link to="/investment" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            Investment
                        </Link>
                        <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            About
                        </Link>
                        <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            Contact
                        </Link>
                    </div>

                    {!user && !loading && (
                        <div className="mobile-auth-buttons">
                            <button
                                className="btn btn-primary btn-block"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate("/register");
                                }}
                            >
                                Create Account
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileNav;