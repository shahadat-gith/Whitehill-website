import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../../Context/AppContext";
import "./BusinessVenture.css";

const initialLocation = {
    village: "", block: "", town: "", city: "", district: "",
    state: "", po: "", ps: "", pincode: "", googleMapLocation: "",
};

const initialDetails = {
    stage: "idea",
    name: "",
    industry: "",
    businessModel: "",
    description: "",
    teamSize: "",
    website: "",
    turnOver: "",
    profitMargin: "",
    outStandingLoan: "",
    purpose: {
        workingCapital: false,
        expansion: false,
        assetPurchase: false,
        other: "",
    },
    fundingType: "equity",
    riskDisclosure: {
        regulatoryRisks: "",
        marketRisks: "",
        seasonalityRisks: "",
        operationalRisks: "",
        dependencyRisks: "",
    },
    businessPartners: [{ name: "", role: "", share: "" }],
};

const initialDocs = {
    businessPlan: null,
    bankStatements: null,
    financialStatements: null,
    gstReturns: null,
    legalDocuments: null,
    cashFlowStatement: null,
};

const BusinessVenture = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    const [amountRequested, setAmountRequested] = useState("");
    const [location, setLocation] = useState(initialLocation);
    const [details, setDetails] = useState(initialDetails);
    const [documents, setDocuments] = useState(initialDocs);
    const [submitting, setSubmitting] = useState(false);

    // --- HANDLERS ---
    const handleDetailChange = (field, value) => {
        setDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handlePurposeChange = (field, value) => {
        setDetails((prev) => ({
            ...prev,
            purpose: { ...prev.purpose, [field]: value },
        }));
    };

    const handleRiskChange = (field, value) => {
        setDetails((prev) => ({
            ...prev,
            riskDisclosure: { ...prev.riskDisclosure, [field]: value },
        }));
    };

    const handleLocationChange = (field, value) => {
        setLocation((prev) => ({ ...prev, [field]: value }));
    };

    const handlePartnerChange = (index, field, value) => {
        const updated = [...details.businessPartners];
        updated[index] = { ...updated[index], [field]: value };
        setDetails({ ...details, businessPartners: updated });
    };

    const addPartner = () => {
        setDetails({
            ...details,
            businessPartners: [...details.businessPartners, { name: "", role: "", share: "" }]
        });
    };

    const removePartner = (index) => {
        setDetails({
            ...details,
            businessPartners: details.businessPartners.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user?._id) return toast.error("Please login to submit a fund request");
        if (submitting) return;

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("amountRequested", amountRequested);
            formData.append("location", JSON.stringify(location));
            formData.append("stage", details.stage);
            formData.append("name", details.name);
            formData.append("industry", details.industry);
            formData.append("businessModel", details.businessModel);
            formData.append("description", details.description);
            formData.append("teamSize", details.teamSize);
            formData.append("website", details.website);
            formData.append("turnOver", details.turnOver);
            formData.append("profitMargin", details.profitMargin);
            formData.append("outStandingLoan", details.outStandingLoan);
            formData.append("purpose", JSON.stringify(details.purpose));
            formData.append("fundingType", details.fundingType);
            formData.append("riskDisclosure", JSON.stringify(details.riskDisclosure));
            formData.append("businessPartners", JSON.stringify(details.businessPartners));

            Object.keys(documents).forEach(key => {
                if (documents[key]) formData.append(key, documents[key]);
            });

            const { data } = await api.post("/api/fund-request/business", formData);
            if (!data.success) throw new Error(data.message || "Submission failed");

            toast.success("Business Venture request submitted successfully!");
            navigate("/request-funds/congratulations", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bus-container">
            <header className="bus-header">
                <h1>Business Venture Funding</h1>
                <p>Complete the application for business expansion or working capital funding.</p>
            </header>

            <form className="bus-form" onSubmit={handleSubmit}>
                
                {/* 1. REQUEST SUMMARY */}
                <div className="bus-section">
                    <h3 className="bus-section-title">1. Funding Summary</h3>
                    <div className="bus-grid bus-grid-2">
                        <div className="bus-field">
                            <label>Amount Requested (₹) *</label>
                            <input type="number" value={amountRequested} onChange={(e) => setAmountRequested(e.target.value)} placeholder="₹ 1,00,00,000" required />
                        </div>
                        <div className="bus-field">
                            <label>Funding Type *</label>
                            <select value={details.fundingType} onChange={(e) => handleDetailChange("fundingType", e.target.value)}>
                                <option value="equity">Equity</option>
                                <option value="profitSharing">Profit Sharing</option>
                                <option value="revenueSharing">Revenue Sharing</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. BUSINESS DETAILS */}
                <div className="bus-section">
                    <h3 className="bus-section-title">2. Business Core Details</h3>
                    <div className="bus-grid bus-grid-2">
                        <div className="bus-field"><label>Business Name *</label><input type="text" value={details.name} onChange={(e) => handleDetailChange("name", e.target.value)} placeholder="Enter business name" required /></div>
                        <div className="bus-field"><label>Industry *</label><input type="text" value={details.industry} onChange={(e) => handleDetailChange("industry", e.target.value)} placeholder="e.g. Manufacturing, Retail" required /></div>
                    </div>
                    <div className="bus-grid bus-grid-3" style={{marginTop: '1rem'}}>
                        <div className="bus-field">
                            <label>Stage *</label>
                            <select value={details.stage} onChange={(e) => handleDetailChange("stage", e.target.value)}>
                                <option value="idea">Idea</option><option value="mvp">MVP</option><option value="growth">Growth</option><option value="scale">Scale</option>
                            </select>
                        </div>
                        <div className="bus-field"><label>Turnover (Annual) *</label><input type="number" value={details.turnOver} onChange={(e) => handleDetailChange("turnOver", e.target.value)} placeholder="₹ in lakhs" required /></div>
                        <div className="bus-field"><label>Profit Margin (%) *</label><input type="text" value={details.profitMargin} onChange={(e) => handleDetailChange("profitMargin", e.target.value)} placeholder="e.g. 15%" required /></div>
                    </div>
                    <div className="bus-field" style={{marginTop: '1rem'}}>
                        <label>Business Model *</label>
                        <textarea rows="3" value={details.businessModel} onChange={(e) => handleDetailChange("businessModel", e.target.value)} placeholder="How do you generate revenue?" required />
                    </div>
                </div>

                {/* 3. PURPOSE & CHECKBOXES */}
                <div className="bus-section">
                    <h3 className="bus-section-title">3. Purpose of Funding</h3>
                    <div className="bus-checkbox-group">
                        <label><input type="checkbox" checked={details.purpose.workingCapital} onChange={(e) => handlePurposeChange("workingCapital", e.target.checked)} /> Working Capital</label>
                        <label><input type="checkbox" checked={details.purpose.expansion} onChange={(e) => handlePurposeChange("expansion", e.target.checked)} /> Expansion</label>
                        <label><input type="checkbox" checked={details.purpose.assetPurchase} onChange={(e) => handlePurposeChange("assetPurchase", e.target.checked)} /> Asset Purchase</label>
                    </div>
                    <div className="bus-field" style={{marginTop: '1rem'}}>
                        <label>Other Purpose</label>
                        <input type="text" value={details.purpose.other} onChange={(e) => handlePurposeChange("other", e.target.value)} placeholder="Specify if other" />
                    </div>
                </div>

                {/* 4. RISK DISCLOSURE */}
                <div className="bus-section">
                    <h3 className="bus-section-title">4. Risk Disclosure</h3>
                    <div className="bus-grid bus-grid-2">
                        <div className="bus-field"><label>Market Risks *</label><textarea rows="3" value={details.riskDisclosure.marketRisks} onChange={(e) => handleRiskChange("marketRisks", e.target.value)} placeholder="Competition, volatility..." required /></div>
                        <div className="bus-field"><label>Operational Risks *</label><textarea rows="3" value={details.riskDisclosure.operationalRisks} onChange={(e) => handleRiskChange("operationalRisks", e.target.value)} placeholder="Supply chain, staffing..." required /></div>
                    </div>
                </div>

                {/* 5. PARTNERS */}
                <div className="bus-section">
                    <h3 className="bus-section-title">5. Business Partners</h3>
                    <div className="bus-partner-list">
                        {details.businessPartners.map((partner, index) => (
                            <div className="bus-partner-card" key={index}>
                                <div className="bus-partner-header">
                                    <span>Partner {index + 1}</span>
                                    {details.businessPartners.length > 1 && (
                                        <button type="button" className="bus-remove-btn" onClick={() => removePartner(index)}><i className="fas fa-times"></i></button>
                                    )}
                                </div>
                                <div className="bus-grid bus-grid-3">
                                    <input type="text" value={partner.name} onChange={(e) => handlePartnerChange(index, "name", e.target.value)} placeholder="Name" required />
                                    <input type="text" value={partner.role} onChange={(e) => handlePartnerChange(index, "role", e.target.value)} placeholder="Role" required />
                                    <input type="number" value={partner.share} onChange={(e) => handlePartnerChange(index, "share", e.target.value)} placeholder="Share %" required />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={addPartner}>+ Add Partner</button>
                </div>

                {/* 6. OPERATING LOCATION */}
                <div className="bus-section">
                    <h3 className="bus-section-title">6. Operating Location</h3>
                    <div className="bus-grid bus-grid-3">
                        <div className="bus-field"><label>State *</label><input type="text" value={location.state} onChange={(e) => handleLocationChange("state", e.target.value)} placeholder="e.g. Assam" required /></div>
                        <div className="bus-field"><label>District *</label><input type="text" value={location.district} onChange={(e) => handleLocationChange("district", e.target.value)} placeholder="District" required /></div>
                        <div className="bus-field"><label>City/Town *</label><input type="text" value={location.city} onChange={(e) => handleLocationChange("city", e.target.value)} placeholder="City" required /></div>
                    </div>
                    <div className="bus-grid bus-grid-4" style={{marginTop: '1rem'}}>
                        <div className="bus-field"><label>Village</label><input type="text" value={location.village} onChange={(e) => handleLocationChange("village", e.target.value)} placeholder="Village" /></div>
                        <div className="bus-field"><label>Block</label><input type="text" value={location.block} onChange={(e) => handleLocationChange("block", e.target.value)} placeholder="Block" /></div>
                        <div className="bus-field"><label>PIN Code *</label><input type="text" value={location.pincode} onChange={(e) => handleLocationChange("pincode", e.target.value)} placeholder="781001" maxLength="6" required /></div>
                        <div className="bus-field"><label>Google Maps Link</label><input type="url" value={location.googleMapLocation} onChange={(e) => handleLocationChange("googleMapLocation", e.target.value)} placeholder="https://..." /></div>
                    </div>
                </div>

                {/* 7. DOCUMENTS */}
                <div className="bus-section">
                    <h3 className="bus-section-title">7. Required Documents (PDF)</h3>
                    <div className="bus-grid bus-grid-2">
                        {Object.keys(initialDocs).map((docKey) => (
                            <div className="bus-field" key={docKey}>
                                <label>{docKey.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} *</label>
                                <div className="bus-file-upload">
                                    <input type="file" accept=".pdf" id={docKey} onChange={(e) => setDocuments({...documents, [docKey]: e.target.files[0]})} required />
                                    <label htmlFor={docKey} className="bus-file-label">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>{documents[docKey] ? documents[docKey].name : "Upload Document"}</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bus-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Final Submission</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessVenture;