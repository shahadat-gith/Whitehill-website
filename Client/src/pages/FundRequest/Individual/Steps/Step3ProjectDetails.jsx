import React from "react";
import "./Steps.css";

const Step3ProjectDetails = ({ details, handleDetailChange }) => {
    return (
        <section className="ifr-section">
            <div className="ifr-section-content">
                <div className="ifr-grid ifr-grid-2">
                    <div className="ifr-field">
                        <label>Category *</label>
                        <select
                            value={details.category}
                            onChange={(event) =>
                                handleDetailChange("category", event.target.value)
                            }
                        >
                            <option value="project_devlopment">Project Development</option>
                            <option value="land_purchase">Land Purchase</option>
                            <option value="land_selling">Land Selling</option>
                        </select>
                    </div>
                    <div className="ifr-field">
                        <label>Individual Type *</label>
                        <select
                            value={details.individualType}
                            onChange={(event) =>
                                handleDetailChange("individualType", event.target.value)
                            }
                        >
                            <option value="agent">Agent</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                </div>

                <div className="ifr-grid ifr-grid-2">
                    <div className="ifr-field">
                        <label>Project Type *</label>
                        <select
                            value={details.projectType}
                            onChange={(event) =>
                                handleDetailChange("projectType", event.target.value)
                            }
                        >
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="agricultural">Agricultural</option>
                            <option value="mixed">Mixed Use</option>
                        </select>
                    </div>
                    <div className="ifr-field">
                        <label>RERA Number *</label>
                        <input
                            type="text"
                            value={details.rera}
                            onChange={(event) => handleDetailChange("rera", event.target.value)}
                            placeholder="e.g., RERA/2024/XX/XXXX"
                            required
                        />
                        <small>Real Estate Regulatory Authority registration number</small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step3ProjectDetails;
