
import { NavLink } from "react-router-dom";
import "./Sidebar.css";


const Sidebar = () => {

const sidebarLinks = [
  { to: "/", icon: "fa-solid fa-house", label: "Home" },

  { to: "/projects", icon: "fa-solid fa-building", label: "Projects" },

  { to: "/investors", icon: "fa-solid fa-users", label: "Investors" },
  
  { to: "/payment-history", icon: "fa-solid fa-money-bill-transfer", label: "Payment History" },

  { to: "/settings", icon: "fa-solid fa-gear", label: "Settings" },
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