import { useNavigate } from "react-router-dom"
import './Hero.css';
import buildingImg from './building.png';
import gearImg from './gear.png';

const Hero = () => {

  const navigate = useNavigate()
  const handleNavigate = (path) =>{
    navigate(path);
  }
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
            <button className="btn btn-primary" onClick={()=>handleNavigate("/sell-property")}>Sell Property</button>
            <button className="btn btn-secondary" onClick={()=>handleNavigate("/request-funds")}>Need Funds ?</button>
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