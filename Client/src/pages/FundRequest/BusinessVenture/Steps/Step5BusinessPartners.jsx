import React from "react";
import "./Steps.css";

const Step5BusinessPartners = ({ 
    details, 
    handleBusinessPartnerChange, 
    addBusinessPartner, 
    removeBusinessPartner 
}) => {
    return (
        <section className="bfr-section">
            <div className="bfr-section-content">
                <div className="bfr-partner-list">
                    {details.businessPartners.map((partner, index) => (
                        <div className="bfr-partner-card" key={`partner-${index}`}>
                            <div className="bfr-partner-card-header">
                                <div className="bfr-partner-badge">Partner {index + 1}</div>
                                {details.businessPartners.length > 1 && (
                                    <button
                                        type="button"
                                        className="bfr-remove-btn"
                                        onClick={() => removeBusinessPartner(index)}
                                        title="Remove partner"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                            <div className="bfr-partner-card-content">
                                <div className="bfr-grid bfr-grid-3">
                                    <div className="bfr-field">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={partner.name}
                                            onChange={(event) =>
                                                handleBusinessPartnerChange(index, "name", event.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="bfr-field">
                                        <label>Role *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Co-Founder, Director"
                                            value={partner.role}
                                            onChange={(event) =>
                                                handleBusinessPartnerChange(index, "role", event.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="bfr-field">
                                        <label>Ownership Share (%) *</label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 25"
                                            value={partner.share}
                                            onChange={(event) =>
                                                handleBusinessPartnerChange(index, "share", event.target.value)
                                            }
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addBusinessPartner}
                >
                    <i className="fas fa-plus"></i> Add Partner
                </button>
            </div>
        </section>
    );
};

export default Step5BusinessPartners;
