import React from "react";
import "./Steps.css";

const Step4CostDetails = ({ details, handleCostChange }) => {
    return (
        <section className="ifr-section">
            <div className="ifr-section-content">
                <div className="ifr-grid ifr-grid-2">
                    <div className="ifr-field">
                        <label>Total Project Cost *</label>
                        <input
                            type="number"
                            value={details.cost.totalProjectCost}
                            onChange={(event) =>
                                handleCostChange("totalProjectCost", event.target.value)
                            }
                            placeholder="₹ 2,00,00,000"
                            required
                        />
                        <small>Overall budget for the entire project</small>
                    </div>
                    <div className="ifr-field">
                        <label>Land Cost *</label>
                        <input
                            type="number"
                            value={details.cost.landCost}
                            onChange={(event) => handleCostChange("landCost", event.target.value)}
                            placeholder="₹ 1,00,00,000"
                            required
                        />
                        <small>Purchase price or valuation of land</small>
                    </div>
                </div>

                <div className="ifr-grid ifr-grid-2">
                    <div className="ifr-field">
                        <label>Construction Cost *</label>
                        <input
                            type="number"
                            value={details.cost.constructionCost}
                            onChange={(event) =>
                                handleCostChange("constructionCost", event.target.value)
                            }
                            placeholder="₹ 80,00,000"
                            required
                        />
                        <small>Estimated development and construction expenses</small>
                    </div>
                    <div className="ifr-field">
                        <label>Funding Already Deployed *</label>
                        <input
                            type="number"
                            value={details.cost.fundingAlreadyDeployed}
                            onChange={(event) =>
                                handleCostChange("fundingAlreadyDeployed", event.target.value)
                            }
                            placeholder="₹ 20,00,000"
                            required
                        />
                        <small>Amount already invested in the project</small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step4CostDetails;
