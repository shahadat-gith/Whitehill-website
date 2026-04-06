import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const founder = {
    name: 'Dr. Mridul Islam',
    title: 'Founder & Chief Strategist',
    bio: 'With over two decades of experience in alternative asset management and structured finance, Dr. Islam founded Whitehill to democratize access to high-yield, institutional-grade investments. His visionary approach combines rigorous risk discipline with technology-driven transparency, creating a trusted ecosystem for sophisticated investors.',
    // Professional placeholder for the founder's image
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' 
  };

  const company = {
    name: 'Whitehill',
    tagline: 'Institutional Alternative Assets for Sophisticated Capital',
    vision: 'To become the global benchmark for transparent, performance-driven alternative investment platforms, bridging the gap between private capital and premier institutional opportunities.',
    mission: 'To empower our exclusive network of investors with curated, high-growth assets in real estate and startups, secured by rigorous diligence and milestone-linked returns.'
  };

  return (
    <div className="abt-page">
      {/* HERO SECTION */}
      <section className="abt-hero">
        <div className="abt-container">
          <span className="abt-hero-tag">The Whitehill Standard</span>
          <h1 className="abt-hero-title">{company.tagline}</h1>
        </div>
      </section>

      {/* FOUNDER & STORY SECTION */}
      <section className="abt-founder">
        <div className="abt-container">
          <div className="abt-founder-grid">
            <div className="abt-founder-image-wrapper">
              <img src={founder.image} alt={founder.name} className="abt-founder-image" />
              <div className="abt-founder-accent"></div>
            </div>
            <div className="abt-founder-content">
              <span className="abt-section-eyebrow">Leadership</span>
              <h2 className="abt-founder-name">{founder.name}</h2>
              <p className="abt-founder-title">{founder.title}</p>
              <div className="abt-section-underline"></div>
              
              <p className="abt-paragraph">
                <strong>Whitehill</strong> emerged as a response to the opacity often found in private equity and real estate markets. Under the leadership of <strong>{founder.name}</strong>, we recognized that while the appetite for alternative assets was growing, the infrastructure to access them remained fragmented.
              </p>
              <p className="abt-paragraph">
                {founder.bio}
              </p>
              <p className="abt-paragraph">
                By combining deep-rooted industry relationships with a modern digital ecosystem, we provide our members with a "first-look" advantage at high-stakes opportunities unavailable to the general public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION CARDS */}
      <section className="abt-purpose">
        <div className="abt-container">
          <div className="abt-purpose-grid">
            <div className="abt-purpose-card abt-vision">
              <div className="abt-purpose-icon"><i className="fas fa-eye"></i></div>
              <h3>Our Vision</h3>
              <p>{company.vision}</p>
            </div>
            <div className="abt-purpose-card abt-mission">
              <div className="abt-purpose-icon"><i className="fas fa-bullseye"></i></div>
              <h3>Our Mission</h3>
              <p>{company.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="abt-philosophy">
        <div className="abt-container">
          <div className="abt-section-header">
            <h2 className="abt-section-title">Our Operating Philosophy</h2>
            <div className="abt-section-underline"></div>
          </div>
          <div className="abt-philosophy-grid">
            <div className="abt-phil-box">
              <h3>Institutional Rigor</h3>
              <p>
                Every investment opportunity undergoes a multi-layered due diligence process. From RERA compliance in real estate to scalability audits in startups, we apply the scrutiny of top-tier investment banking.
              </p>
            </div>
            <div className="abt-phil-box">
              <h3>Aligned Interests</h3>
              <p>
                We believe in performance-linked outcomes. Our model is designed so that returns are realized through structured distribution events, ensuring all stakeholders are moving toward milestone-driven success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="abt-cta">
        <div className="abt-container">
          <div className="abt-cta-wrapper">
            <h2 className="abt-cta-title">Ready to Start Your Journey?</h2>
            <p className="abt-cta-subtitle">Join the exclusive network of visionaries and institutional investors.</p>
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