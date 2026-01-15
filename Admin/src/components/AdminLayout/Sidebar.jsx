import { NavLink } from "react-router-dom";


const Sidebar = ({ onNavigate }) => {
  const sidebarLinks = [
    { to: "/", icon: "fa-solid fa-house", label: "Home" },
    { to: "/projects", icon: "fa-solid fa-building", label: "Projects" },
    { to: "/users", icon: "fa-solid fa-user", label: "Users" },
    { to: "/investments", icon: "fa-solid fa-hand-holding-dollar", label: "Investments" },
    { to: "/payment-history", icon: "fa-solid fa-clock-rotate-left", label: "Payment History" },
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
