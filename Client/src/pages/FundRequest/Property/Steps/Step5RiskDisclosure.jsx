import React from "react";
import "./Steps.css";

const Step5RiskDisclosure = ({ details, handleRiskChange }) => {
    return (
        <section className="ifr-section">
            <div className="ifr-section-content">
                <div className="ifr-grid ifr-grid-2">
                    <div className="ifr-field">
                        <label>Execution Risks *</label>
                        <textarea
                            rows="4"
                            value={details.riskDisclosure.executionRisks}
                            onChange={(event) =>
                                handleRiskChange("executionRisks", event.target.value)
                            }
                            placeholder="Describe potential delays, contractor issues, approval challenges, construction risks..."
                            required
                        ></textarea>
                    </div>
                    <div className="ifr-field">
                        <label>Market Risks *</label>
                        <textarea
                            rows="4"
                            value={details.riskDisclosure.marketRisks}
                            onChange={(event) =>
                                handleRiskChange("marketRisks", event.target.value)
                            }
                            placeholder="Describe market volatility, demand fluctuations, pricing risks, location competitiveness..."
                            required
                        ></textarea>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step5RiskDisclosure;
