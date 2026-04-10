import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import buildingImg from "./building.png";
import gearImg from "./gear.png";
import FundModal from "./FundModal";

const Hero = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: "Deployed", value: "$2.5M+" },
    { label: "Success Rate", value: "98%" },
    { label: "Avg. Approval", value: "72 hrs" },
  ];

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleFundSelection = (type) => {
    if (!isLoggedIn) return; 
    setIsModalOpen(false);
    navigate(`/funding?type=${type}`);
  };

  return (
    <section className="he-hero">
      {/* ── Background grid + glow ── */}
      <div className="he-hero-bg">
        <div className="he-hero-glow he-hero-glow-1" />
        <div className="he-hero-glow he-hero-glow-2" />
        <div className="he-hero-grid" />
      </div>

      <div className="he-hero-body">
        {/* Left illustration */}
        <div className="he-hero-illus he-hero-illus-left">
          <div className="he-illus-card">
            <img src={buildingImg} alt="Real Estate" />
            <span className="he-illus-label">Real Estate</span>
          </div>
        </div>

        {/* Center content */}
        <div className="he-hero-center">
          <div className="he-hero-eyebrow">
            <span className="he-eyebrow-dot" />
            Trusted by 500+ global investors
          </div>

          <h1 className="he-hero-title">
            Smart capital.<br />
            <span className="he-hero-title-italic">Real returns.</span>
          </h1>

          <div className="he-hero-ctas">
            {!isLoggedIn && (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/auth")}
              >
                Get started
                <i className="fas fa-rocket"></i>
              </button>
            )}
            
            <button
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(true)}
            >
              Need funding? Apply Here!
            </button>
          </div>

          <div className="he-hero-trust">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                <div className="he-trust-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
                {index < stats.length - 1 && <div className="he-trust-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right illustration */}
        <div className="he-hero-illus he-hero-illus-right">
          <div className="he-illus-card">
            <img src={gearImg} alt="Startups" />
            <span className="he-illus-label">Startups</span>
          </div>
        </div>
      </div>

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