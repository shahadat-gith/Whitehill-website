import React from 'react';
import './Stats.css';

const Stats = () => {
  // Centralized Data Object
  const statsData = [
    {
      id: 1,
      value: "27+",
      label: "Institutional Investors",
      sublabel: "Verified HNI & Network",
      icon: "fa-users",
      color: "stat-blue"
    },
    {
      id: 2,
      value: "₹17,000Cr",
      label: "Asset Valuation",
      sublabel: "Total Managed Portfolio",
      icon: "fa-chart-pie",
      color: "stat-yellow"
    },
    {
      id: 3,
      value: "Performance",
      label: "Linked Returns",
      sublabel: "Milestone-Driven Model",
      icon: "fa-arrow-trend-up",
      color: "stat-mint"
    }
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">Platform Trust Metrics</h2>
          <div className="stats-underline"></div>
        </div>

        <div className="stats-grid">
          {statsData.map((stat) => (
            <div key={stat.id} className={`stat-card ${stat.id === 2 ? 'stat-card-highlight' : ''}`}>
              <div className={`stat-icon-wrapper ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-sublabel">{stat.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;