import { NavLink } from "react-router-dom";


const Sidebar = ({ onNavigate }) => {
const sidebarLinks = [
    { to: "/", icon: "fa-solid fa-gauge-high", label: "Dashboard" }, // More standard for Admin Home
    { to: "/projects", icon: "fa-solid fa-city", label: "Projects" }, // Better for Real Estate/Development
    { to: "/users", icon: "fa-solid fa-users-gear", label: "Users" }, // Represents 'Management'
    { to: "/investments", icon: "fa-solid fa-chart-line", label: "Investments" }, // Represents growth/equity
    { to: "/fund-requests", icon: "fa-solid fa-file-invoice-dollar", label: "Fund Requests" }, // Represents the 'Application/Form' nature
    { to: "/property-selling", icon: "fa-solid fa-house-chimney-window", label: "Property Selling" }, // More detailed house icon
    { to: "/payment-history", icon: "fa-solid fa-receipt", label: "Payment History" }, // Better for financial records
  ];
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {sidebarLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
              {link.badge > 0 && <span className="badge">{link.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
