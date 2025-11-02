import React from 'react';
import './Stats.css';
import gpayLogo from './gpay.png'
import razorpayLogo from './razorpay.png'

const Stats = () => {

  const partners = [
    {
      id: 1,
      name: "Google Pay",
      logo: gpayLogo,
    },
    {
      id: 2,
      name: "Razorpay",
      logo: razorpayLogo,
    },
  ]
  return (
    <section className="stats-section">
      <div className="stats-container">
        <h2 className="stats-title">Trust Stats</h2>

        <div className="stats-grid">
          {/* Investors Stat */}
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-blue">
              <span className="stat-number">27</span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Investors</p>
            </div>
          </div>

          {/* AUM Stat */}
          <div className="stat-card stat-card-highlight">
            <div className="stat-icon-wrapper stat-icon-yellow">
              <span className="stat-currency">₹</span>
            </div>
            <div className="stat-info">
              <p className="stat-value">17,000,000,000,000</p>
              <p className="stat-label-small">AUM</p>
              <p className="stat-sublabel">Hold dollars.</p>
            </div>
          </div>

          {/* ROI Stat */}
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-light-blue">
              <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-value">0.00%</p>
              <p className="stat-label-small">permitted ROI,</p>
              <p className="stat-sublabel">performance, linked only.</p>
            </div>
          </div>
        </div>

        {/* Payment Partners */}
        <div className="payment-partners">
          {
            partners.map((partner, index) => {
              return (
                <div className="partner-logo" key={index}>
                  <img src={partner.logo} alt="gpay-logo" style={{ width: "40px", borderRadius: "50%" }} />
                  <span>{partner.name}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </section>
  );
};

export default Stats;