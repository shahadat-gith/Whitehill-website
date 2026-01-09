import React, { useState } from 'react';
import './Contact.css';
import { contactDetails, whatsappDetails } from './utils';
import api from '../../Configs/axios';
import toast from "react-hot-toast";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        consent: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            const { data } = await api.post("/api/admin/contact/create", formData);

            if (!data.success) {
                throw new Error(data.message);
            }

            setSubmitted(true);
            toast.success("Message sent successfully!");

            setFormData({
                name: "",
                email: "",
                phone: "",
                message: "",
                consent: false,
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to send message. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };





    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-container">
                    <h1 className="contact-hero-title">Get in Touch</h1>
                    <p className="contact-hero-subtitle">
                        Have questions? We're here to help you navigate your investment journey
                    </p>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="contact-main">
                <div className="contact-container">
                    <div className="contact-wrapper">
                        {/* Contact Information */}
                        <div className="contact-info">
                            <h2 className="contact-info-title">Contact Information</h2>
                            <p className="contact-info-text">
                                Reach out to us through any of the following channels. Our team is ready to assist you.
                            </p>

                            <div className="contact-items">
                                {contactDetails.map((item) => (
                                    <div className="contact-item" key={item.id}>
                                        <div className="contact-icon">
                                            <i className={`fa-solid ${item.icon}`}></i>
                                        </div>

                                        <div className="contact-details">
                                            <h3>{item.title}</h3>
                                            <p>{item.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* WhatsApp Button */}
                            <a
                                href={whatsappDetails.link}
                                className="whatsapp-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa-brands fa-whatsapp"></i>
                                <span>{whatsappDetails.label}</span>
                            </a>

                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <div className="contact-form-card">
                                <h2 className="contact-form-title">Send us a Message</h2>

                                {submitted && (
                                    <div className="form-success">
                                        <i className="fa-solid fa-circle-check"></i>
                                        <p>Thank you! We've received your enquiry and will respond within 24 hours.</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91-XXXXXXXXXX"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <div className="form-group-checkbox">
                                        <input
                                            type="checkbox"
                                            id="consent"
                                            name="consent"
                                            checked={formData.consent}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="consent">
                                            I consent to WHITEHILLL processing my personal data for investment administration as per its Privacy Policy.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || submitted}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                                <span style={{ marginLeft: "8px" }}>Sending...</span>
                                            </>
                                        ) : submitted ? (
                                            "Message Sent!"
                                        ) : (
                                            "Submit Enquiry"
                                        )}
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section 
      <section className="contact-map">
        <div className="contact-container">
          <h2 className="map-title">Find Us</h2>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.123456789!2d91.7362!3d26.1445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA4JzQwLjIiTiA5McKwNDQnMTAuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="WHITEHILLL Office Location"
            ></iframe>
          </div>
        </div>
      </section> */}

            {/* Disclaimer */}
            <section className="contact-disclaimer">
                <div className="contact-container">
                    <div className="disclaimer-box">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <p>
                            <strong>Important:</strong> Investments are subject to market risks. Please read all documents carefully before investing. WHITEHILLL does not guarantee returns.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;