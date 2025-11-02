import React from "react";
import "./WhyInvest.css";

const WhyInvest = () => {
  const cards = [
    {
      title: "By the visioners & the visionaries",
      desc: "Curated network & access for exceptional investors.",
      points: [
        "Exclusive network",
        "Peer calibration",
        "Mentorship",
      ],
      color: "pink",
      button: "Explore Network",
    },
    {
      title: "Lucrative land and future-safe plays",
      desc: "Secure premium properties and benefit from long-term appreciation.",
      points: [
        "Minimal land loads",
        "Even period profits",
        "Strong ROI projection",
      ],
      color: "yellow",
      button: "View More",
    },
    {
      title: "Strong returns via smart startups",
      desc: "Gain insight-driven exposure through data-led startup investments.",
      points: [
        "Cross-domain insights",
        "Data-driven decisions",
        "Investor intelligence",
      ],
      color: "blue",
      button: "View More",
    },
    {
      title: "Backing the next big startup",
      desc: "Early-stage investment access with a scalable mentorship approach.",
      points: [
        "Pre-blockbuster entry",
        "Mentorship hubs",
        "Roadmap access",
      ],
      color: "mint",
      button: "View Details",
    },
  ];

  return (
    <section className="why-invest">
      <div className="why-header">
        <h2>WHY INVEST WITH WHITEHILL</h2>
      </div>

      <div className="cards-container">
        {cards.map((card, index) => (
          <div key={index} className={`invest-card ${card.color}`}>
            <div className="card-header">
              <h3>{card.title}</h3>
            </div>
            <div className="card-body">
              <p className="desc">{card.desc}</p>
              <ul>
                {card.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <button className="btn btn-primary">{card.button}</button>
              <p className="note">No guaranteed returns.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyInvest;
