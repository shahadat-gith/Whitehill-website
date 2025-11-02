import React from "react";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* LEFT SECTION */}
        <div className="footer-section footer-left">
          <img src="/logo.png" alt="Whitehilll Logo" className="footer-logo" />
          <p className="footer-description">
            WHITEHILLL is a digital investment platform enabling verified investors to
            discover, evaluate, and participate in curated real estate and startup
            opportunities. We combine transparency, regulatory compliance, and
            performance-linked growth to deliver trusted investment experiences.
          </p>

          <div className="footer-social">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="footer-section footer-center">
          <h3>QUICK LINKS</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Business Rules</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="footer-section footer-right">
          <h3>CONTACT US</h3>
          <p><i className="fas fa-envelope"></i> whitehilll.info@gmail.com</p>
          <p><i className="fas fa-phone"></i> +91 8474896216 | +91 7662824778</p>

          <form className="subscribe-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit"><i className="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} WHITEHILLL. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;
