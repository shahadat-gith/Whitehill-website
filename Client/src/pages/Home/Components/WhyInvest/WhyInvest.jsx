import React from "react";
import "./WhyInvest.css";

const WhyInvest = () => {
  const cards = [
    {
      title:
        "By the Visionary for the Visionaries, Exclusive Network and Connections",
      desc: "Join a circle of forward-thinking investors and achievers. Whitehill connects you with visionaries, entrepreneurs, and financial experts who share a common goal — strategic wealth creation and long-term success.",
      points: [
        "Exclusive network of successful individuals",
        "Access to mentors and financial experts",
        "Collaborative growth and shared insights",
      ],
      color: "pink",
      button: "Explore Network",
    },
    {
      title: "Lucrative Real Estate, Land Deals and Futuristic Investments",
      desc: "Invest in premium real estate and land assets that ensure steady appreciation. Whitehill identifies future-ready projects offering high returns and sustainable long-term value for investors.",
      points: [
        "Premium land and property investments",
        "High return and appreciation potential",
        "Future-focused real estate opportunities",
      ],
      color: "yellow",
      button: "View More",
    },
    {
      title: "Strong Returns and Smart Investment Strategies",
      desc: "Stay ahead with Whitehill’s data-driven investment approach. Our experts analyze trends, manage risks, and create diversified strategies that consistently deliver reliable and profitable returns.",
      points: [
        "Research-backed investment insights",
        "Data-driven and trend-focused planning",
        "Optimized strategies for better returns",
      ],
      color: "blue",
      button: "View More",
    },
    {
      title: "Supporting the Next Big Startup",
      desc: "Whitehill identifies and funds promising startups with strong potential. Our mentorship and seed funding help them grow — giving investors early access to scalable, high-growth business ventures.",
      points: [
        "Seed investment in promising startups",
        "Hands-on mentoring and business guidance",
        "Early-stage entry into growth ventures",
      ],
      color: "mint",
      button: "View Details",
    },
  ];

  return (
    <section className="why-invest">
      <div className="why-header">
        <h2>WHY TO INVEST WITH WHITEHILL</h2>
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyInvest;
