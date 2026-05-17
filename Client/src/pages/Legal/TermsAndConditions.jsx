import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Legal.css";

const TermsAndConditions = () => {
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
        <span className="legal-eyebrow">Terms & Conditions</span>
        <h1>Terms & Conditions</h1>
        <p>
          By using WHITEHILLL, you agree to comply with and be bound by these terms.
          These conditions apply to all users, visitors, investors, and fundraisers
          accessing the platform.
        </p>
        <section>
          <h2>Use of the Platform</h2>
          <p>
            You may use WHITEHILLL for lawful investment and funding activities only.
            The platform is not financial advice. Any decisions made based on the
            platform’s content are your own responsibility.
          </p>
        </section>
        <section>
          <h2>Account Responsibilities</h2>
          <p>
            You are responsible for keeping your account credentials secure and for
            all activity under your account. Notify WHITEHILLL immediately if you
            suspect unauthorized access.
          </p>
        </section>
        <section>
          <h2>Payments and Transactions</h2>
          <p>
            All payments, deposits, and withdrawals are processed through Razorpay
            as our payment gateway partner. WHITEHILLL does not directly handle card
            or bank details, and all transaction completion depends on Razorpay’s
            payment authorization and settlement procedures.
          </p>
          <p>
            WHITEHILLL does not guarantee investment returns. Your use of the
            payment services is also subject to Razorpay’s terms and conditions.
          </p>
        </section>
        <section>
          <h2>Amendments</h2>
          <p>
            WHITEHILLL may update these terms at any time. Continued use of the
            platform after changes constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
