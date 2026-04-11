import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      <div className="admin-layout">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

        <div className="admin-main">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="content-body">{children}</main>
        </div>

        {isSidebarOpen && (
          <div className="mobile-overlay" onClick={closeSidebar}></div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default AdminLayout;