import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/Consent.css';

const Consent = ({ formData, updateFormData, currentStep }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get('type');
  const stepFromUrl = searchParams.get('step') || currentStep || 3;
  return (
    <div className="cs-container">
      <h2 className="cs-title">Terms and Consent</h2>
      <p className="cs-subtitle">
        Please read and agree to the following terms before submitting your application.
      </p>

      <div className="cs-consent-items">
        <div className="cs-consent-item">
          <label className="cs-checkbox-label">
            <input
              type="checkbox"
              checked={formData.consent.agreedToTerms}
              onChange={(e) => updateFormData('consent.agreedToTerms', e.target.checked)}
              required
            />
            <span className="cs-checkbox-text">
              I agree to the <Link to={`/terms-and-conditions?from=/funding&type=${typeFromUrl}&step=${stepFromUrl}`} className="cs-link">Terms and Conditions</Link>
              <span className="cs-required">*</span>
            </span>
          </label>
        </div>

        <div className="cs-consent-item">
          <label className="cs-checkbox-label">
            <input
              type="checkbox"
              checked={formData.consent.agreedToPrivacyPolicy}
              onChange={(e) => updateFormData('consent.agreedToPrivacyPolicy', e.target.checked)}
              required
            />
            <span className="cs-checkbox-text">
              I agree to the <Link to={`/privacy-policy?from=/funding&type=${typeFromUrl}&step=${stepFromUrl}`} className="cs-link">Privacy Policy</Link>
              <span className="cs-required">*</span>
            </span>
          </label>
        </div>

        <div className="cs-consent-item">
          <label className="cs-checkbox-label">
            <input
              type="checkbox"
              checked={formData.consent.agreedToCreditCheck}
              onChange={(e) => updateFormData('consent.agreedToCreditCheck', e.target.checked)}
              required
            />
            <span className="cs-checkbox-text">
              I authorize credit check and background verification
              <span className="cs-required">*</span>
            </span>
          </label>
        </div>
      </div>

      <div className="cs-notice">
        <p className="cs-notice-text">
          By submitting this application, you consent to the processing of your personal and financial information
          for the purpose of evaluating your funding request. All information provided will be kept confidential
          and secure in accordance with our privacy policy.
        </p>
      </div>
    </div>
  );
};

export default Consent;