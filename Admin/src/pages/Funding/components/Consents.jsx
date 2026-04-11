import React from "react";
import "./Consents.css";
import { formatDate } from "../../../utils/utility";

const Consents = ({ funding }) => {
  if (!funding) return null;

  return (
    <div className="co-card">
      <div className="co-card-title">
        <i className="fa-solid fa-handshake"></i>
        <h3>Applicant Consent</h3>
      </div>

      <div className="co-consents">
        <div className="co-consent-item">
          <span className="co-consent-label">Agreed to Terms & Conditions</span>
          <span className={`co-consent-value ${funding.consent?.agreedToTerms ? "yes" : "no"}`}>
            {funding.consent?.agreedToTerms ? "✓ Yes" : "✗ No"}
          </span>
        </div>

        <div className="co-consent-item">
          <span className="co-consent-label">Agreed to Privacy Policy</span>
          <span className={`co-consent-value ${funding.consent?.agreedToPrivacyPolicy ? "yes" : "no"}`}>
            {funding.consent?.agreedToPrivacyPolicy ? "✓ Yes" : "✗ No"}
          </span>
        </div>

        <div className="co-consent-item">
          <span className="co-consent-label">Agreed to Credit Check</span>
          <span className={`co-consent-value ${funding.consent?.agreedToCreditCheck ? "yes" : "no"}`}>
            {funding.consent?.agreedToCreditCheck ? "✓ Yes" : "✗ No"}
          </span>
        </div>

        {funding.consent?.consentedAt && (
          <div className="co-consent-item">
            <span className="co-consent-label">Consented on</span>
            <span className="co-info-value">{formatDate(funding.consent.consentedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consents;