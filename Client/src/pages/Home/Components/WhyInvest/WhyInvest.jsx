import React from "react";
import "./WhyInvest.css";

const WhyInvest = () => {
  const cards = [
    {
      title: "Exclusive Network & Connections",
      desc: "Join a circle of forward-thinking investors. Whitehill connects you with visionaries and financial experts for strategic wealth creation.",
      points: [
        "Exclusive network of achievers",
        "Access to financial mentors",
        "Collaborative growth insights",
      ],
      icon: "fa-network-wired",
    },
    {
      title: "Futuristic Real Estate Deals",
      desc: "Invest in premium real estate and land assets. We identify future-ready projects offering high returns and sustainable value.",
      points: [
        "Premium property investments",
        "High appreciation potential",
        "Future-focused land deals",
      ],
      icon: "fa-city",
    },
    {
      title: "Smart Investment Strategies",
      desc: "Stay ahead with a data-driven approach. Our experts analyze trends and manage risks to deliver profitable returns.",
      points: [
        "Research-backed insights",
        "Trend-focused planning",
        "Optimized risk management",
      ],
      icon: "fa-chart-pie",
    },
    {
      title: "The Next Big Startup",
      desc: "We identify and fund promising startups. Get early access to scalable, high-growth business ventures and seed opportunities.",
      points: [
        "Seed-stage opportunities",
        "Hands-on business guidance",
        "Early entry into unicorns",
      ],
      icon: "fa-rocket",
    },
  ];

  return (
    <section className="wi-section">
      <div className="wi-container">
        <header className="wi-header">
          <span className="wi-eyebrow">The Whitehill Advantage</span>
          <h2 className="wi-title">Why to invest with Whitehill</h2>
          <p className="wi-subtitle">
            Strategic assets and elite connections engineered for the modern investor.
          </p>
        </header>

        <div className="wi-grid">
          {cards.map((card, index) => (
            <div key={index} className="wi-card">
              <div className="wi-card-icon">
                <i className={`fas ${card.icon}`}></i>
              </div>
              
              <div className="wi-card-content">
                <h3 className="wi-card-title">{card.title}</h3>
                <p className="wi-card-desc">{card.desc}</p>
                
                <ul className="wi-card-list">
                  {card.points.map((point, i) => (
                    <li key={i}>
                      <i className="fas fa-check-circle"></i>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyInvest;