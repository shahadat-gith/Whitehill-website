import React from "react";
import "./Steps.css";

const Step4RiskDisclosure = ({ details, handleRiskChange }) => {
    return (
        <section className="bfr-section">
            <div className="bfr-section-content">
                <div className="bfr-grid bfr-grid-2">
                    <div className="bfr-field">
                        <label>Regulatory Risks *</label>
                        <textarea
                            rows="3"
                            value={details.riskDisclosure.regulatoryRisks}
                            onChange={(event) =>
                                handleRiskChange("regulatoryRisks", event.target.value)
                            }
                            placeholder="Describe compliance, licensing, and regulatory challenges..."
                            required
                        ></textarea>
                    </div>
                    <div className="bfr-field">
                        <label>Market Risks *</label>
                        <textarea
                            rows="3"
                            value={details.riskDisclosure.marketRisks}
                            onChange={(event) =>
                                handleRiskChange("marketRisks", event.target.value)
                            }
                            placeholder="Describe competition, market volatility, and demand risks..."
                            required
                        ></textarea>
                    </div>
                    <div className="bfr-field">
                        <label>Seasonality Risks *</label>
                        <textarea
                            rows="3"
                            value={details.riskDisclosure.seasonalityRisks}
                            onChange={(event) =>
                                handleRiskChange("seasonalityRisks", event.target.value)
                            }
                            placeholder="Describe seasonal variations in revenue and operations..."
                            required
                        ></textarea>
                    </div>
                    <div className="bfr-field">
                        <label>Operational Risks *</label>
                        <textarea
                            rows="3"
                            value={details.riskDisclosure.operationalRisks}
                            onChange={(event) =>
                                handleRiskChange("operationalRisks", event.target.value)
                            }
                            placeholder="Describe supply chain, production, and staffing risks..."
                            required
                        ></textarea>
                    </div>
                    <div className="bfr-field full">
                        <label>Dependency Risks *</label>
                        <textarea
                            rows="3"
                            value={details.riskDisclosure.dependencyRisks}
                            onChange={(event) =>
                                handleRiskChange("dependencyRisks", event.target.value)
                            }
                            placeholder="Describe key customer, supplier, or technology dependencies..."
                            required
                        ></textarea>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step4RiskDisclosure;
