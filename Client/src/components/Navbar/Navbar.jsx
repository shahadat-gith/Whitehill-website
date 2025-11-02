import React, { useState, useEffect } from "react";
import "./Navbar.css";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import axios from "axios";
import api from "../../Configs/axios";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingout, setLoggingOut] = useState(false)
  const { setUser } = useAppContext()

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [mobileMenuOpen]);


  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const { data } = await api.post("/user/logout")
      if (data.success) {
        setUser(null)
        toast.success("Logged out!")
      }
    } catch (error) {
      toast.error(error?.reponse?.data?.message)
      console.log("Error while loging out:", error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* LOGO */}
        <div className="navbar-logo">
          <img src="/logo.png" alt="Whitehilll Logo" className="navbar-logo-img" />
          <span className="navbar-title">WHITEHILLL</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="desktop-nav">
          <DesktopNav
            handleLogout={handleLogout}
            loggingout={loggingout}
          />
        </div>

        {/* MOBILE NAV */}
        <div className="mobile-nav">
          <MobileNav
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            handleLogout={handleLogout}
            loggingout={loggingout}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
