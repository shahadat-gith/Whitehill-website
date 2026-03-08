import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

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
    { step: '01', title: 'Registration', desc: 'Securely create your professional investor profile.' },
    { step: '02', title: 'KYC Verification', desc: 'Complete institutional-grade compliance checks.' },
    { step: '03', title: 'Invest', desc: 'Select curated projects that align with your goals.' },
    { step: '04', title: 'Allocation', desc: 'Confirm your position in the investment round.' },
    { step: '05', title: 'Monitoring', desc: 'Real-time performance tracking via your dashboard.' },
    { step: '06', title: 'Exit', desc: 'Realize returns through structured distribution events.' }
  ];

  const faqs = [
    {
      question: 'Who can invest?',
      answer: 'Accredited individuals, family offices, or HNIs who meet our internal verification criteria and compliance standards.'
    },
    {
      question: 'What are the risks?',
      answer: 'Alternative investments involve liquidity, market, and counterparty risks. We provide a full risk disclosure for every project.'
    },
    {
      question: 'How are returns distributed?',
      answer: 'We follow a performance-linked model. Distributions are made based on project milestones and actual realization of returns.'
    }
  ];

  return (
    <div className="abt-page">
      {/* Hero Section */}
      <section className="abt-hero">
        <div className="abt-container">
          <span className="abt-hero-tag">Institutional Alternative Assets</span>
          <h1 className="abt-hero-title">Elevate Your Portfolio with Whitehill</h1>
          <p className="abt-hero-subtitle">
            We bridge the gap between private capital and institutional-grade opportunities through transparency and rigorous discipline.
          </p>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="abt-metrics">
        <div className="abt-container">
          <div className="abt-metrics-banner">
            <div className="abt-metric-item">
              <span className="abt-metric-value">27</span>
              <span className="abt-metric-label">Elite Investors</span>
            </div>
            <div className="abt-metric-divider"></div>
            <div className="abt-metric-item">
              <span className="abt-metric-value">₹17,000Cr+</span>
              <span className="abt-metric-label">Assets Under Management</span>
            </div>
            <div className="abt-metric-divider"></div>
            <div className="abt-metric-item">
              <span className="abt-metric-value">Performance</span>
              <span className="abt-metric-label">Milestone-Linked ROI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="abt-pillars">
        <div className="abt-container">
          <div className="abt-section-header">
            <h2 className="abt-section-title">Core Pillars</h2>
            <div className="abt-section-underline"></div>
          </div>
          <div className="abt-pillars-grid">
            {pillars.map((pillar, index) => (
              <div key={index} className="abt-pillar-card">
                <div className={`abt-pillar-accent ${pillar.color}`}></div>
                <div className="abt-pillar-icon">
                  <i className={pillar.icon}></i>
                </div>
                <h3 className="abt-pillar-title">{pillar.title}</h3>
                <p className="abt-pillar-description">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle Section */}
      <section className="abt-lifecycle">
        <div className="abt-container">
          <div className="abt-section-header">
            <h2 className="abt-section-title">Investment Lifecycle</h2>
            <p className="abt-section-subtitle">A seamless journey from registration to exit</p>
          </div>
          <div className="abt-lifecycle-grid">
            {lifecycle.map((item, index) => (
              <div key={index} className="abt-lifecycle-item">
                <div className="abt-lifecycle-number">{item.step}</div>
                <div className="abt-lifecycle-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="abt-faq">
        <div className="abt-container">
          <h2 className="abt-section-title">Knowledge Base</h2>
          <div className="abt-faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="abt-faq-card">
                <h3 className="abt-faq-question">{faq.question}</h3>
                <p className="abt-faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="abt-cta">
        <div className="abt-container">
          <div className="abt-cta-wrapper">
            <h2 className="abt-cta-title">Ready to Start Your Journey?</h2>
            <p className="abt-cta-subtitle">Apply for membership to access our private placement opportunities.</p>
            <div className="abt-cta-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/register')}>Create Account</button>
              <button className="btn btn-secondary" onClick={() => navigate('/projects')}>Explore Projects</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;