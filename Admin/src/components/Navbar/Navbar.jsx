import React from "react";
import "./Navbar.css";
import { useAppContext } from "../../context/AppContext";

const Navbar = ({ toggleSidebar }) => {
  const { token, setToken, navigate, theme, toggleTheme } = useAppContext();

  const logoutHandler = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">

        {/* Left Section */}
        <div className="nav-left-admin">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div
            className="nav-logo-admin"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="whitehill capital"
              className="logo-img"
            />

            <div className="brand-name">
              <h2 className="brand-title">Whitehill</h2>
              <h4 className="brand-subtitle">
                Capital <span className="admin-badge">Admin</span>
              </h4>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          <button
            className="theme-btn"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <i
              className={`fa-solid ${
                theme === "dark" ? "fa-sun" : "fa-moon"
              }`}
            ></i>
          </button>

          {token && (
            <button
              className="btn btn-primary"
              onClick={logoutHandler}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
