import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    { to: "/", icon: "fa-solid fa-chart-pie", label: "Dashboard" },
    { to: "/projects", icon: "fa-solid fa-building-circle-check", label: "Projects" },
    { to: "/users", icon: "fa-solid fa-users-gear", label: "Users" },
    { to: "/investments", icon: "fa-solid fa-money-bill-trend-up", label: "Investments" },
    { to: "/properties", icon: "fa-solid fa-house-lock", label: "Property Sales" },
    { to: "/payments", icon: "fa-solid fa-file-invoice-dollar", label: "Payments" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src="/logo.png" alt="Whitehill" className="sidebar-logo" />
        <div className="logo-text">
          <h3>Whitehill</h3>
          <span>Capital Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;