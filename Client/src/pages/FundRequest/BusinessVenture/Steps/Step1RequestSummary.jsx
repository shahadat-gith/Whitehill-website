import React from "react";
import "./Steps.css";

const Step1RequestSummary = ({ amountRequested, setAmountRequested, details, handleDetailChange }) => {
    return (
        <section className="bfr-section">
            <div className="bfr-section-content">
                <div className="bfr-grid bfr-grid-2">
                    <div className="bfr-field">
                        <label>Amount Requested *</label>
                        <input
                            type="number"
                            value={amountRequested}
                            onChange={(event) => setAmountRequested(event.target.value)}
                            placeholder="₹ 1,00,00,000"
                            required
                        />
                    </div>
                    <div className="bfr-field">
                        <label>Funding Type *</label>
                        <select
                            value={details.fundingType}
                            onChange={(event) =>
                                handleDetailChange("fundingType", event.target.value)
                            }
                        >
                            <option value="equity">Equity</option>
                            <option value="profitSharing">Profit Sharing</option>
                            <option value="revenueSharing">Revenue Sharing</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step1RequestSummary;
