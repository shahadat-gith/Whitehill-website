import React from 'react';
import './About.css';

const About = () => {
  const pillars = [
    {
      title: 'Exclusive Network',
      description: 'Entry by KYC verification; institutional-grade deals only.',
      icon: 'fa-solid fa-shield-halved',
      color: 'accent-mint'
    },
    {
      title: 'Deal Access',
      description: 'Early-stage or private opportunities unavailable to the public.',
      icon: 'fa-solid fa-bullseye',
      color: 'accent-light-blue'
    },
    {
      title: 'Strategic Discipline',
      description: 'Managed exposure, exit-focused structuring.',
      icon: 'fa-solid fa-chart-line',
      color: 'accent-pink'
    },
    {
      title: 'Risk Awareness',
      description: 'Every project listed with risk summary and audit trail.',
      icon: 'fa-solid fa-scale-balanced',
      color: 'accent-light-yellow'
    }
  ];

  const lifecycle = [
    { step: '01', title: 'Registration', desc: 'Create your account' },
    { step: '02', title: 'KYC Verification', desc: 'Complete compliance' },
    { step: '03', title: 'Invest', desc: 'Invest on different projects' },
    { step: '04', title: 'Allocation Confirmation', desc: 'Investment confirmed' },
    { step: '05', title: 'Performance Monitoring', desc: 'Track progress' },
    { step: '06', title: 'Distributions / Exit', desc: 'Realize returns' }
  ];

  const faqs = [
    {
      question: 'Who can invest?',
      answer: 'Accredited individuals, family offices, or HNIs who meet our verification criteria.'
    },
    {
      question: 'What are the risks?',
      answer: 'Liquidity, market, and counterparty risks. All investments are subject to market conditions.'
    },
    {
      question: 'How are returns distributed?',
      answer: 'Based on actual performance, not fixed returns. We follow a performance-linked model.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <h1 className="about-hero-title">Why Invest with WHITEHILLL</h1>
          <p className="about-hero-subtitle">
            Our approach to alternative investments emphasizes transparency, compliance, and value creation.
          </p>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="about-pillars">
        <div className="about-container">
          <h2 className="section-title">Core Pillars</h2>
          <div className="pillars-grid">
            {pillars.map((pillar, index) => (
              <div key={index} className="pillar-card">
                <div className={`pillar-accent ${pillar.color}`}></div>
                <div className="pillar-icon">
                  <i className={pillar.icon}></i>
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Lifecycle */}
      <section className="about-lifecycle">
        <div className="about-container">
          <h2 className="section-title">Investment Lifecycle</h2>
          <p className="section-subtitle">Your journey from registration to exit</p>
          <div className="lifecycle-timeline">
            {lifecycle.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-step">{item.step}</div>
                <div className="timeline-content">
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
                {index < lifecycle.length - 1 && <div className="timeline-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="about-metrics">
        <div className="about-container">
          <div className="metrics-banner">
            <div className="metric-item">
              <div className="metric-value">27</div>
              <div className="metric-label">Investors</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-value">₹17,000Cr+</div>
              <div className="metric-label">AUM</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-value">Performance Linked</div>
              <div className="metric-label">No Fixed ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="about-faq">
        <div className="about-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Investment Journey?</h2>
            <p className="cta-subtitle">Join our exclusive network of strategic investors</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Create Account</button>
              <button className="btn btn-secondary">Explore Opportunities</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;