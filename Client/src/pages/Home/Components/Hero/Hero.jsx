import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import buildingImg from "./building.png";
import gearImg from "./gear.png";
import FundModal from "./FundModal";

const Hero = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleFundSelection = (type) => {
    if (!isLoggedIn) return; // modal handles the unauth UI
    setIsModalOpen(false);
    navigate(`/funding?type=${type}`);
  };

  return (
    <section className="hero">
      {/* ── Background grid + glow ── */}
      <div className="hero-bg">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-grid" />
      </div>

      {/* ── Main layout ── */}
      <div className="hero-body">
        {/* Left illustration */}
        <div className="hero-illus hero-illus-left">
          <div className="illus-card illus-card-left">
            <img src={buildingImg} alt="Real Estate" />
            <span className="illus-label">Real Estate</span>
          </div>
        </div>

        {/* Center content */}
        <div className="hero-center">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Trusted by 500+ investors
          </div>

          <h1 className="hero-title">
            Smart capital.<br />
            <em>Real returns.</em>
          </h1>

          <p className="hero-subtitle">
            Real estate acquisitions and startup ventures — one platform
            engineered for performance.
          </p>

          <div className="hero-ctas">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >

              Get started
              <i className="fas fa-rocket" style={{ marginLeft: "4px" }}></i>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(true)}
            >
              Need Funds?
            </button>
          </div>

          <div className="hero-trust">
            <div className="trust-stat">
              <strong>$2.5M+</strong>
              <span>Deployed</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-stat">
              <strong>98%</strong>
              <span>Success Rate</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-stat">
              <strong>72 hrs</strong>
              <span>Avg. Approval</span>
            </div>
          </div>
        </div>

        {/* Right illustration */}
        <div className="hero-illus hero-illus-right">
          <div className="illus-card illus-card-right">
            <img src={gearImg} alt="Startups" />
            <span className="illus-label">Startups</span>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <FundModal
          isLoggedIn={isLoggedIn}
          setIsModalOpen={setIsModalOpen}
          handleFundSelection={handleFundSelection}
        />
      )}
    </section>
  );
};

export default Hero;