import React from "react";
import { useAppContext } from "../../context/AppContext";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const { token, setToken, navigate } = useAppContext();

  const logoutHandler = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
      </div>

      <div className="nav-right">
        {token && (
          <button className="logout-btn" onClick={logoutHandler}>
            <span>Logout</span>
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;