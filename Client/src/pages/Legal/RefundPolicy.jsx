import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Legal.css";

const RefundPolicy = () => {
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
        <span className="legal-eyebrow">Refund Policy</span>
        <h1>Refund Policy</h1>
        <p>
          WHITEHILLL aims to provide a fair and transparent experience. This policy
          explains our approach to refunds and payment reversals.
        </p>
        <section>
          <h2>Final Payments</h2>
          <p>
            Payments made for investment participation or funding services are
            generally final. Refunds are provided only when required by applicable
            law or if a payment was made in error.
          </p>
        </section>
        <section>
          <h2>Requesting a Refund</h2>
          <p>
            If you believe you qualify for a refund, contact our support team with
            a full explanation and any supporting documentation.
          </p>
          <p>
            Refunds are subject to Razorpay’s payment gateway policies and any
            transaction reversal rules they enforce.
          </p>
        </section>
        <section>
          <h2>Processing</h2>
          <p>
            Approved refunds will be processed using the original payment method via
            Razorpay and may take several business days to appear in your account.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
