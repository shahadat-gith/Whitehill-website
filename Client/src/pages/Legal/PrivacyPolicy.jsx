import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Legal.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const type = searchParams.get("type");
  const step = searchParams.get("step");

  const handleBack = () => {
    if (from && type && step) {
      navigate(`${from}?type=${type}&step=${step}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="legal-back-btn" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <span className="legal-eyebrow">Privacy Policy</span>
        <h1>Privacy Policy</h1>
        <p>
          WHITEHILLL respects your privacy. This policy explains what personal data
          we collect, how we use it, and how we protect it.
        </p>
        <section>
          <h2>Data Collection</h2>
          <p>
            We collect information you provide when registering, applying for
            funding, investing, or contacting support. This includes contact details,
            identity documents, and financial information required for verification.
          </p>
        </section>
        <section>
          <h2>Use of Information</h2>
          <p>
            Your data is used to verify your identity, manage investments and
            funding requests, process payments through Razorpay, and communicate
            important updates.
          </p>
        </section>
        <section>
          <h2>Data Sharing</h2>
          <p>
            We may share your information with trusted service providers, including
            Razorpay for payment processing, compliance partners, and regulators when
            required by law. We do not sell your personal data.
          </p>
        </section>
        <section>
          <h2>Security</h2>
          <p>
            We maintain appropriate technical and organizational measures to protect
            your personal information from unauthorized access, disclosure, or loss.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
