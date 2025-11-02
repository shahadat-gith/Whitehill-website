import React, { useState } from "react";
import "./FeaturedOpportunities.css";

const FeaturedOpportunities = () => {
    const [formData, setFormData] = useState({
        label: '',
        comment: ''
    });

    const opportunities = [
        {
            title: "Luxury Apartments",
            desc: "Invest in premium real estate starting from just ₹25 Lakhs.",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
        },
        {
            title: "AgriTech Harvesters",
            desc: "Early-stage funding opportunity for AI-driven agriculture startups.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
        },
        {
            title: "AgriTech Estate",
            desc: "Fractional investment available for AgriTech project — Unit A1.",
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="featured-opportunities-wrapper">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div className="featured-header">
                <h2>Featured Opportunities</h2>
                <button className="menu-btn">
                    <i className="fas fa-ellipsis-v"></i>
                </button>
            </div>

            <div className="content-container">
                <div className="left-section">
                    <h3 className="section-title">How It Works</h3>
                    <div className="steps-container">
                        <p className="section-subtitle">
                            Want to explore investment options?<br />Fill out the quick form to get started.
                        </p>

                        <div>
                            <div className="steps-flow">
                                <div className="step-icon-wrapper user-step">
                                    <i className="fas fa-user"></i>
                                </div>
                                <span className="step-divider">·····</span>
                                <div className="step-icon-wrapper document-step">
                                    <i className="fas fa-file-alt"></i>
                                </div>
                                <span className="step-divider">·····</span>
                                <div className="step-icon-wrapper chart-step">
                                    <i className="fas fa-chart-bar"></i>
                                </div>
                                <span className="step-divider">·····</span>
                                <div className="step-icon-wrapper handshake-step">
                                    <i className="fas fa-handshake"></i>
                                </div>
                                <div className="arrow-next">
                                    <i className="fas fa-chevron-right"></i>
                                </div>
                            </div>

                            <p className="payment-methods">
                                Available payment methods: UPI, cards, net banking, wallets.
                            </p>
                        </div>
                    </div>

                    <div className="opportunities-grid">
                        {opportunities.map((item, index) => (
                            <div key={index} className={`opportunity-card card-${index + 1}`}>
                                <img src={item.image} alt={item.title} />
                                <div className="card-content">
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-section">
                    <h3 className="enquiry-title">Quick Enquiry</h3>
                    <div className="enquiry-form">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="form-input"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        />
                        <textarea
                            placeholder="Your Message"
                            className="form-textarea"
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        ></textarea>
                        <button
                            type="button"
                            className="access-btn"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <p className="visit-link">
                            For more details, visit our website at <span className="highlight">www.whitehill.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedOpportunities;
