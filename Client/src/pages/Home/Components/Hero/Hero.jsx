import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Hero.css';
import buildingImg from './building.png';
import gearImg from './gear.png';
import FundModal from "./FundModal";

const Hero = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFundSelection = (type) => {
    setIsModalOpen(false);
    navigate(`/request-funds?type=${type}`);
  };

  return (
    <section className="hero">
      <div className="hero-container">
        {/* LEFT ILLUSTRATION */}
        <div className="hero-illustration hero-illustration-left">
          <img src={buildingImg} alt="Strategic Real Estate" className="building-img" />
        </div>

        {/* CENTER CONTENT */}
        <div className="hero-content">
          <h1 className="hero-title">
            Strategic real estate and startup investments.
          </h1>
          <p className="hero-subtitle">
            Curated access. Institutional diligence. Performance-linked outcomes 
            delivered through a transparent digital platform.
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/sell-property")}
            >
              Sell Property
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsModalOpen(true)}
            >
              Need Funds?
            </button>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="hero-illustration hero-illustration-right">
          <img src={gearImg} alt="Startup Innovation" className="gear-img" />
        </div>
      </div>

      {/* FUNDING TYPE SELECTION MODAL */}
      {isModalOpen && (
        <FundModal setIsModalOpen={setIsModalOpen} handleFundSelection={handleFundSelection}/>
      )}
    </section>
  );
};

export default Hero;