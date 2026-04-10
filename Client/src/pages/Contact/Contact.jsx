import React, { useState } from 'react';
import './Contact.css';
import { contactDetails, whatsappDetails } from './utils';
import api from '../../configs/axios';
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '', consent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/query/create", formData);
      if (!data.success) throw new Error(data.message);
      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "", consent: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="co-page">
      <section className="co-hero">
        <div className="co-container">
          <h1 className="co-hero-title">Get in Touch</h1>
          <p className="co-hero-sub">Expert guidance for your investment journey.</p>
        </div>
      </section>

      <section className="co-main">
        <div className="co-container">
          <div className="co-wrapper">
            {/* LEFT SIDE: Now properly spaced and colored */}
            <div className="co-info-side">
              <span className="co-tag">Contact Us</span>
              <h2 className="co-side-title">Contact Information</h2>
              <p className="co-side-text">
                Reach out to us through any of these channels. Our team usually responds within 24 hours.
              </p>
              
              <div className="co-list">
                {contactDetails.map((item) => (
                  <div className="co-list-item" key={item.id}>
                    <div className="co-icon-box"><i className={`fas ${item.icon}`}></i></div>
                    <div className="co-text-box">
                      <h3>{item.title}</h3>
                      <p>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href={whatsappDetails.link} className="co-wa-btn" target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp"></i> {whatsappDetails.label}
              </a>
            </div>

            {/* RIGHT SIDE (THE CARD) */}
            <div className="co-form-side">
              <div className="co-card">
                <h2 className="co-card-title">Send us a Message</h2>
                {submitted && (
                  <div className="co-success-msg">
                    <i className="fas fa-check-circle"></i> Message sent successfully!
                  </div>
                )}
                <form onSubmit={handleSubmit} className="co-form">
                  <div className="co-input-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. Mridul Islam" />
                  </div>
                  <div className="co-input-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contact@whitehill.in" />
                  </div>
                  <div className="co-input-group">
                    <label>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91-XXXXXXXXXX" />
                  </div>
                  <div className="co-input-group">
                    <label>Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" placeholder="How can we help?"></textarea>
                  </div>
                  <div className="co-check-group">
                    <input type="checkbox" id="co-con" name="consent" checked={formData.consent} onChange={handleChange} required />
                    <label htmlFor="co-con">I consent to the processing of my data as per the Privacy Policy.</label>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit Enquiry"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;