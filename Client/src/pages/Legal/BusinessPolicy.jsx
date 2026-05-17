import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Legal.css";

const BusinessPolicy = () => {
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
        <span className="legal-eyebrow">Business Policy</span>
        <h1>Business Policy</h1>
        <p>
          WHITEHILLL provides investment and funding services in compliance with
          regulatory standards. This policy outlines our business principles.
        </p>
        <section>
          <h2>Investment Approach</h2>
          <p>
            Our platform showcases curated opportunities while enabling transparent
            access to real estate and startup investments.
          </p>
        </section>
        <section>
          <h2>Payment Processing</h2>
          <p>
            WHITEHILLL uses Razorpay for payment collection and settlement. All
            payment transactions are subject to Razorpay’s gateway terms and
            verification procedures.
          </p>
        </section>
        <section>
          <h2>Risk Disclosure</h2>
          <p>
            Investments carry risk. Past performance is not indicative of future
            results. Users must assess risk and suitability independently.
          </p>
        </section>
        <section>
          <h2>Compliance</h2>
          <p>
            We operate in accordance with applicable laws, anti-fraud, and
            anti-money laundering policies, and we require accurate customer
            information.
          </p>
        </section>
      </div>
    </div>
  );
};

export default BusinessPolicy;
