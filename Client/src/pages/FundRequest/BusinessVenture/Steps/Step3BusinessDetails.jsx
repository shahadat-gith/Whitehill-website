import React from "react";
import "./Steps.css";

const Step3BusinessDetails = ({ details, handleDetailChange, handlePurposeChange }) => {
    return (
        <section className="bfr-section">
            <div className="bfr-section-content">
                <div className="bfr-grid bfr-grid-2">
                    <div className="bfr-field">
                        <label>Business Name *</label>
                        <input
                            type="text"
                            value={details.name}
                            onChange={(event) =>
                                handleDetailChange("name", event.target.value)
                            }
                            placeholder="Enter your business name"
                            required
                        />
                    </div>
                    <div className="bfr-field">
                        <label>Industry *</label>
                        <input
                            type="text"
                            value={details.industry}
                            onChange={(event) =>
                                handleDetailChange("industry", event.target.value)
                            }
                            placeholder="e.g., Manufacturing, Retail, Services"
                            required
                        />
                    </div>
                </div>

                <div className="bfr-grid bfr-grid-3">
                    <div className="bfr-field">
                        <label>Stage *</label>
                        <select
                            value={details.stage}
                            onChange={(event) =>
                                handleDetailChange("stage", event.target.value)
                            }
                        >
                            <option value="idea">Idea</option>
                            <option value="mvp">MVP</option>
                            <option value="growth">Growth</option>
                            <option value="scale">Scale</option>
                        </select>
                    </div>
                    <div className="bfr-field">
                        <label>Team Size *</label>
                        <input
                            type="number"
                            value={details.teamSize}
                            onChange={(event) =>
                                handleDetailChange("teamSize", event.target.value)
                            }
                            placeholder="Number of employees"
                            required
                        />
                    </div>
                    <div className="bfr-field">
                        <label>Website</label>
                        <input
                            type="text"
                            value={details.website}
                            onChange={(event) =>
                                handleDetailChange("website", event.target.value)
                            }
                            placeholder="https://your-website.com"
                        />
                    </div>
                </div>

                <div className="bfr-grid bfr-grid-3">
                    <div className="bfr-field">
                        <label>Annual Turnover</label>
                        <input
                            type="number"
                            value={details.turnOver}
                            onChange={(event) =>
                                handleDetailChange("turnOver", event.target.value)
                            }
                            placeholder="₹ in lakhs"
                        />
                        <small>Last financial year revenue</small>
                    </div>
                    <div className="bfr-field">
                        <label>Profit Margin *</label>
                        <input
                            type="text"
                            value={details.profitMargin}
                            onChange={(event) =>
                                handleDetailChange("profitMargin", event.target.value)
                            }
                            placeholder="e.g., 15%"
                            required
                        />
                        <small>Current profit margin percentage</small>
                    </div>
                    <div className="bfr-field">
                        <label>Outstanding Loan</label>
                        <input
                            type="number"
                            value={details.outStandingLoan}
                            onChange={(event) =>
                                handleDetailChange("outStandingLoan", event.target.value)
                            }
                            placeholder="₹ amount if any"
                        />
                        <small>Existing debt obligations</small>
                    </div>
                </div>

                <div className="bfr-divider"></div>

                <div className="bfr-field full">
                    <label>Business Model *</label>
                    <textarea
                        rows="3"
                        value={details.businessModel}
                        onChange={(event) =>
                            handleDetailChange("businessModel", event.target.value)
                        }
                        placeholder="Describe your business model, how you generate revenue, and key value propositions..."
                        required
                    ></textarea>
                </div>

                <div className="bfr-field full">
                    <label>Business Description *</label>
                    <textarea
                        rows="4"
                        value={details.description}
                        onChange={(event) =>
                            handleDetailChange("description", event.target.value)
                        }
                        placeholder="Provide a comprehensive overview of your business including products/services, target market, competitive advantages, and growth trajectory..."
                        required
                    ></textarea>
                </div>

                <div className="bfr-divider"></div>

                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>
                    Purpose of Funding
                </h3>
                <div className="bfr-checkboxes">
                    <label>
                        <input
                            type="checkbox"
                            checked={details.purpose.workingCapital}
                            onChange={(event) =>
                                handlePurposeChange("workingCapital", event.target.checked)
                            }
                        />
                        Working Capital
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={details.purpose.expansion}
                            onChange={(event) =>
                                handlePurposeChange("expansion", event.target.checked)
                            }
                        />
                        Business Expansion
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={details.purpose.assetPurchase}
                            onChange={(event) =>
                                handlePurposeChange("assetPurchase", event.target.checked)
                            }
                        />
                        Asset Purchase
                    </label>
                </div>

                <div className="bfr-field full" style={{ marginTop: "1rem" }}>
                    <label>Other Purpose (if any)</label>
                    <input
                        type="text"
                        value={details.purpose.other}
                        onChange={(event) =>
                            handlePurposeChange("other", event.target.value)
                        }
                        placeholder="Specify any other purpose for funding"
                    />
                </div>
            </div>
        </section>
    );
};

export default Step3BusinessDetails;
