import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ABOUT_CONTENT } from './data'; 
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const data = ABOUT_CONTENT;

  return (
    <div className="abt-page">
      {/* ── HERO ── */}
      <section className="abt-hero">
        <div className="abt-container">
          <span className="abt-eyebrow">{data.hero.eyebrow}</span>
          <h1 className="abt-hero-title">
            {data.hero.titleMain} <br />
            <span>{data.hero.titleAccent}</span>
          </h1>
          <p className="abt-hero-lead">{data.hero.lead}</p>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="abt-metrics">
        <div className="abt-container">
          <div className="abt-metrics-grid">
            {data.metrics.map((m, i) => (
              <div key={i} className="abt-metric-card">
                <h3>{m.value}</h3>
                <p>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="abt-founder">
        <div className="abt-container">
          <div className="abt-founder-grid">
            <div className="abt-founder-image-container">
              <img src={data.founder.image} alt={data.founder.name} className="abt-founder-img" />
              <div className="abt-founder-experience">
                <strong>{data.founder.experience}</strong>
                <span>{data.founder.experienceLabel}</span>
              </div>
            </div>
            <div className="abt-founder-text">
              <span className="abt-section-tag">Leadership</span>
              <h2>{data.founder.name}</h2>
              <p className="abt-founder-title">{data.founder.designation}</p>
              {data.founder.bio.map((para, i) => (
                <p key={i} className="abt-paragraph">{para}</p>
              ))}
              <div className="abt-founder-quote">"{data.founder.quote}"</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="abt-story">
        <div className="abt-container">
          <div className="abt-story-grid">
            <div className="abt-story-content">
              <span className="abt-section-tag">{data.story.tag}</span>
              <h2 className="abt-story-h2">{data.story.title}</h2>
              <p className="abt-story-p">{data.story.description}</p>
              
              <div className="abt-story-check-list">
                <div className="abt-check-item">
                  <i className="fas fa-circle-check"></i>
                  <span>Direct access to Tier-1 developers</span>
                </div>
                <div className="abt-check-item">
                  <i className="fas fa-circle-check"></i>
                  <span>Zero information asymmetry</span>
                </div>
              </div>
            </div>

            <div className="abt-story-visual-modern">
              <div className="abt-visual-stack">
                {data.story.steps.map((step, i) => (
                  <div key={i} className={`abt-stack-card abt-stack-${i + 1}`}>
                    <div className="abt-stack-number">0{i + 1}</div>
                    <div className="abt-stack-info">
                      <h4>{step.label}</h4>
                      <p>{step.desc}</p>
                    </div>
                    <i className="fas fa-shield-halved abt-stack-icon"></i>
                  </div>
                ))}
                {/* Decorative Elements */}
                <div className="abt-visual-circle"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="abt-pillars">
        <div className="abt-container">
          <div className="abt-section-header">
            <h2>{data.pillars.title}</h2>
            <p>{data.pillars.subtitle}</p>
          </div>
          <div className="abt-pillars-grid">
            {data.pillars.items.map((pillar, i) => (
              <div key={i} className="abt-pillar-card">
                <div className="abt-icon"><i className={`fas ${pillar.icon}`}></i></div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="abt-cta">
        <div className="abt-container">
          <div className="abt-cta-card" style={{ backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url(${data.cta.bgImage})` }}>
            <h2>{data.cta.title}</h2>
            <p>{data.cta.subtitle}</p>
            <div className="abt-cta-btns">
              <button className="btn btn-primary" onClick={() => navigate('/auth')}>{data.cta.primaryBtn}</button>
              <button className="btn btn-secondary" onClick={() => navigate('/projects')}>{data.cta.secondaryBtn}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;