import React, { useState } from "react";
import "./FeaturedOpportunities.css";

const FeaturedOpportunities = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: ""
  });

  const steps = [
    {
      icon: "fa-user",
      name: "Register",
      color: "fo-step-amber",
      desc: "Create your account"
    },
    {
      icon: "fa-file-alt",
      name: "KYC",
      color: "fo-step-pink",
      desc: "Complete verification"
    },
    {
      icon: "fa-chart-bar",
      name: "Analyze",
      color: "fo-step-blue",
      desc: "Review opportunities"
    },
    {
      icon: "fa-handshake",
      name: "Invest",
      color: "fo-step-green",
      desc: "Start your investment journey"
    }
  ];

  const opportunities = [
    {
      title: "Luxury Apartments",
      desc: "Invest in premium real estate starting from just ₹25 Lakhs.",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
      color: "fo-card-blue"
    },
    {
      title: "AgriTech Harvesters",
      desc:
        "Early-stage funding opportunity for AI-driven agriculture startups.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
      color: "fo-card-pink"
    },
    {
      title: "AgriTech Estate",
      desc:
        "Fractional investment available for AgriTech project — Unit A1.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
      color: "fo-card-amber"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your interest! We will contact you soon.");
    setFormData({ name: "", message: "" });
  };

  return (
    <div className="fo-container">
      <div className="fo-wrapper">
        
        {/* Header */}
        <div className="fo-header">
          <h1>Featured Opportunities</h1>
        </div>

        <div className="fo-body">
          <div className="fo-grid">

            {/* LEFT CONTENT */}
            <div className="fo-main">

              {/* How it works */}
              <div className="fo-section">
                <h2>How It Works</h2>
                <p>
                  Want to explore investment options?
                  <br />
                  Fill out the quick form to get started.
                </p>

                <div className="fo-steps-card">
                  <div className="fo-steps">
                    {steps.map((step, index) => (
                      <div key={index} className="fo-step">
                        <div className="fo-step-icon-wrapper">
                          <div className={`fo-step-icon ${step.color}`}>
                            <i className={`fas ${step.icon}`}></i>
                          </div>

                          <div className="fo-step-number">
                            {index + 1}
                          </div>
                        </div>

                        <div className="fo-step-text">
                          <p className="fo-step-title">{step.name}</p>
                          <p className="fo-step-desc">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="fo-payment-info">
                    <i className="fas fa-credit-card"></i>
                    <span>
                      Accepted Payments: UPI • Cards • Net Banking • Wallets
                    </span>
                  </div>
                </div>
              </div>

              {/* Opportunities */}
              <div className="fo-section">
                <h3>Investment Options</h3>

                <div className="fo-opportunities">
                  {opportunities.map((item, index) => (
                    <div
                      key={index}
                      className={`fo-opportunity-card ${item.color}`}
                    >
                      <div className="fo-card-image">
                        <img src={item.image} alt={item.title} />
                      </div>

                      <div className="fo-card-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT SIDE FORM */}
            <div className="fo-sidebar">

              <div className="fo-enquiry-card">
                <h3>
                  <i className="fas fa-envelope"></i> Quick Enquiry
                </h3>

                <form onSubmit={handleSubmit} className="fo-form">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />

                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  ></textarea>

                  <button type="submit">
                    Submit Enquiry
                  </button>
                </form>

                <p className="fo-security-note">
                  <i className="fas fa-shield-alt"></i>
                  Your information is secure and confidential
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default FeaturedOpportunities;