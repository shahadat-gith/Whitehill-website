import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import Spinner from "../Spinner/Spinner";

const DesktopNav = ({ loggingout, handleLogout }) => {
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

    return (
        <>
            {/* LEFT SECTION - Empty for now, can add search or other elements */}
            <div className="navbar-left">
                {/* Add search bar or other left elements here if needed */}
            </div>

            {/* CENTER NAV LINKS */}
            <div className="navbar-center">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/projects" className="nav-link">Projects</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
            </div>

            {/* RIGHT SECTION */}
            <div className="navbar-right" ref={dropdownRef}>
                {loading ? (
                    <Spinner size="medium" color="primary" />
                ) : user && user.fullName ? (
                    <div className="navbar-user">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="user-btn"
                        >
                            <img
                                src={user.image?.url || "/user.png"}
                                alt={user.fullName}
                                className="user-avatar"
                            />
                            <span className="user-name">{user.fullName}</span>
                            <i
                                className={`fa-solid fa-chevron-down user-arrow ${dropdownOpen ? "rotate" : ""
                                    }`}
                            ></i>
                        </button>

                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link
                                    to="/profile"
                                    className="dropdown-item"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <i className="fa-solid fa-user"></i> Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="dropdown-item"
                                    onClick={() => setDropdownOpen(false)}
                                >
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
                    <div className="auth-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/register")}
                        >
                            Create Account
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default DesktopNav;