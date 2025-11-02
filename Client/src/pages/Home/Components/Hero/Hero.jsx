import React from 'react';
import './Hero.css';
import buildingImg from './building.png';
import gearImg from './gear.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-illustration hero-illustration-left">
          <img src={buildingImg} alt="Buildings" className="building-img" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Strategic real estate and startup investments.
          </h1>
          <p className="hero-subtitle">
            Curated access. Institutional diligence, Performance
            <br />
            -linked outcomes.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Explore</button>
          </div>
        </div>

        <div className="hero-illustration hero-illustration-right">
          <img src={gearImg} alt="Innovation" className="gear-img" />
        </div>
      </div>
    </section>
  );
};

export default Hero;