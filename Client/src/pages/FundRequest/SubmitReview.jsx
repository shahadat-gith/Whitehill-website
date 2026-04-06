import React from "react";

const SubmitReview = ({ summaryData }) => {
    return (
        <div className="submit-review-section">
            <div className="submit-header">
                <div className="submit-icon">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h2>Submit</h2>
            </div>

            <div className="submit-summary">
                <div className="summary-item">
                    <span className="summary-label">{summaryData.label}:</span>
                    <span className={`summary-value`}>
                        {summaryData.value}
                    </span>
                </div>

            </div>

            <div className="submit-notice">
                <i className="fas fa-info-circle"></i>
                <div>
                    <strong>Important:</strong> Once submitted, your application will be reviewed by our team.
                    You will be notified about the status via email.
                </div>
            </div>
        </div>
    );
};

export default SubmitReview;
