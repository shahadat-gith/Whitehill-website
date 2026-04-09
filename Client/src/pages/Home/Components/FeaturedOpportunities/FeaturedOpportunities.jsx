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
                      Accepted Payments: UPI • Cards • Net Banking
                    </span>
                  </div>
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

                  <button type="submit" className="btn btn-secondary">
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