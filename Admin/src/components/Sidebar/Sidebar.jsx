
import { NavLink } from "react-router-dom";
import "./Sidebar.css";


const Sidebar = () => {

const sidebarLinks = [
  { to: "/", icon: "fas fa-home", label: "Home" },


  // System
  { to: "/settings", icon: "fas fa-cogs", label: "Settings" },
];

  return (
    <div className="admin-sidebar">
      <ul className="sidebar-menu">
        {sidebarLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
              <i className={link.icon}></i> {link.label}
              {link.badge > 0 && <span className="badge">{link.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;