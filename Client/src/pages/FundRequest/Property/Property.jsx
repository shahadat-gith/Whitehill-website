import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../../Context/AppContext";
import "./Property.css";

const initialLocation = {
    village: "", block: "", town: "", city: "", district: "",
    state: "", po: "", ps: "", pincode: "", googleMapLocation: "",
};

const initialDetails = {
    category: "project_devlopment",
    individualType: "individual", // Matches schema: agent or individual
    projectType: "residential",
    rera: "",
    cost: {
        totalProjectCost: "",
        landCost: "",
        constructionCost: "",
        fundingAlreadyDeployed: "",
    },
    riskDisclosure: {
        executionRisks: "",
        marketRisks: "",
    },
};

const initialDocs = {
    landOwnershipProof: null,
    layout: null,
    reraCertificate: null,
    financialModel: null,
};

const Property = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    const [amountRequested, setAmountRequested] = useState("");
    const [location, setLocation] = useState(initialLocation);
    const [details, setDetails] = useState(initialDetails);
    const [documents, setDocuments] = useState(initialDocs);
    const [submitting, setSubmitting] = useState(false);

    const handleDetailChange = (field, value) => {
        setDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleCostChange = (field, value) => {
        setDetails((prev) => ({
            ...prev,
            cost: { ...prev.cost, [field]: Number(value) },
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user?._id) return toast.error("Please login to submit a fund request");
        
        // Agent validation check before sending to backend
        if (details.individualType === "agent") {
            if (!documents.reraCertificate || !documents.financialModel) {
                return toast.error("Agents must provide RERA Certificate and Financial Model");
            }
        }

        if (submitting) return;

        try {
            setSubmitting(true);
            const formData = new FormData();
            
            // Top level fields
            formData.append("category", details.category);
            formData.append("individualType", details.individualType);
            formData.append("projectType", details.projectType);
            formData.append("amountRequested", Number(amountRequested));
            formData.append("rera", details.rera || "");

            // JSON objects
            formData.append("cost", JSON.stringify(details.cost));
            formData.append("riskDisclosure", JSON.stringify(details.riskDisclosure));
            formData.append("location", JSON.stringify(location));

            // Files
            Object.keys(documents).forEach(key => {
                if (documents[key]) formData.append(key, documents[key]);
            });

            const { data } = await api.post("/api/fund-request/property", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                toast.success("Property fund request submitted successfully!");
                navigate("/request-funds/congratulations", { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pro-container">
            <header className="pro-header">
                <h1>Property/Land Funding Application</h1>
                <p>Submit your project details for institutional investment review.</p>
            </header>

            <form className="pro-form" onSubmit={handleSubmit}>
                
                {/* 1. FUNDING SUMMARY */}
                <div className="pro-section">
                    <h3 className="pro-section-title">1. Funding Summary</h3>
                    <div className="pro-grid pro-grid-2">
                        <div className="pro-field">
                            <label>Amount Requested (₹) *</label>
                            <input
                                type="number"
                                value={amountRequested}
                                onChange={(e) => setAmountRequested(e.target.value)}
                                placeholder="₹ 50,00,000"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 2. PROJECT DETAILS */}
                <div className="pro-section">
                    <h3 className="pro-section-title">2. Project Information</h3>
                    <div className="pro-grid pro-grid-3">
                        <div className="pro-field">
                            <label>Category *</label>
                            <select value={details.category} onChange={(e) => handleDetailChange("category", e.target.value)}>
                                <option value="project_devlopment">Project Development</option>
                                <option value="land_purchase">Land Purchase</option>
                                <option value="land_selling">Land Selling</option>
                            </select>
                        </div>
                        <div className="pro-field">
                            <label>Individual Type *</label>
                            <select value={details.individualType} onChange={(e) => handleDetailChange("individualType", e.target.value)}>
                                <option value="individual">Individual / Owner</option>
                                <option value="agent">Authorized Agent</option>
                            </select>
                        </div>
                        <div className="pro-field">
                            <label>Project Type *</label>
                            <select value={details.projectType} onChange={(e) => handleDetailChange("projectType", e.target.value)}>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="agricultural">Agricultural</option>
                                <option value="mixed">Mixed Use</option>
                            </select>
                        </div>
                    </div>
                    <div className="pro-field" style={{ marginTop: '1.5rem' }}>
                        <label>RERA Number (Optional if Land Selling)</label>
                        <input
                            type="text"
                            value={details.rera}
                            onChange={(e) => handleDetailChange("rera", e.target.value)}
                            placeholder="e.g., RERA/2024/XX/XXXX"
                        />
                    </div>
                </div>

                {/* 3. COST DETAILS */}
                <div className="pro-section">
                    <h3 className="pro-section-title">3. Financial Breakdown</h3>
                    <div className="pro-grid pro-grid-2">
                        <div className="pro-field"><label>Total Project Cost (₹) *</label><input type="number" value={details.cost.totalProjectCost} onChange={(e) => handleCostChange("totalProjectCost", e.target.value)} required /></div>
                        <div className="pro-field"><label>Land Cost (₹) *</label><input type="number" value={details.cost.landCost} onChange={(e) => handleCostChange("landCost", e.target.value)} required /></div>
                    </div>
                    <div className="pro-grid pro-grid-2" style={{ marginTop: '1rem' }}>
                        <div className="pro-field"><label>Construction Cost (₹)</label><input type="number" value={details.cost.constructionCost} onChange={(e) => handleCostChange("constructionCost", e.target.value)} /></div>
                        <div className="pro-field"><label>Funding Already Deployed (₹)</label><input type="number" value={details.cost.fundingAlreadyDeployed} onChange={(e) => handleCostChange("fundingAlreadyDeployed", e.target.value)} /></div>
                    </div>
                </div>

                {/* 4. RISK DISCLOSURE */}
                <div className="pro-section">
                    <h3 className="pro-section-title">4. Risk Disclosure</h3>
                    <div className="pro-grid pro-grid-2">
                        <div className="pro-field">
                            <label>Execution Risks *</label>
                            <textarea rows="3" value={details.riskDisclosure.executionRisks} onChange={(e) => handleRiskChange("executionRisks", e.target.value)} placeholder="e.g., Potential construction delays..." required />
                        </div>
                        <div className="pro-field">
                            <label>Market Risks *</label>
                            <textarea rows="3" value={details.riskDisclosure.marketRisks} onChange={(e) => handleRiskChange("marketRisks", e.target.value)} placeholder="e.g., Price fluctuations in the area..." required />
                        </div>
                    </div>
                </div>

                {/* 5. LOCATION */}
                <div className="pro-section">
                    <h3 className="pro-section-title">5. Property Location</h3>
                    <div className="pro-grid pro-grid-3">
                        <div className="pro-field"><label>City *</label><input type="text" value={location.city} onChange={(e) => handleLocationChange("city", e.target.value)} required /></div>
                        <div className="pro-field"><label>District *</label><input type="text" value={location.district} onChange={(e) => handleLocationChange("district", e.target.value)} required /></div>
                        <div className="pro-field"><label>State *</label><input type="text" value={location.state} onChange={(e) => handleLocationChange("state", e.target.value)} required /></div>
                    </div>
                    <div className="pro-grid pro-grid-2" style={{ marginTop: '1rem' }}>
                        <div className="pro-field"><label>PIN Code *</label><input type="text" value={location.pincode} onChange={(e) => handleLocationChange("pincode", e.target.value)} required /></div>
                        <div className="pro-field"><label>Google Maps Link</label><input type="url" value={location.googleMapLocation} onChange={(e) => handleLocationChange("googleMapLocation", e.target.value)} /></div>
                    </div>
                </div>

                {/* 6. DOCUMENTS */}
                <div className="pro-section">
                    <h3 className="pro-section-title">6. Required Documents (PDF)</h3>
                    <div className="pro-grid pro-grid-2">
                        <div className="pro-field">
                            <label>Land Ownership Proof *</label>
                            <input type="file" accept=".pdf" onChange={(e) => setDocuments({ ...documents, landOwnershipProof: e.target.files[0] })} required />
                        </div>
                        <div className="pro-field">
                            <label>Layout Plan *</label>
                            <input type="file" accept=".pdf" onChange={(e) => setDocuments({ ...documents, layout: e.target.files[0] })} required />
                        </div>
                        <div className="pro-field">
                            <label>RERA Certificate {details.individualType === "agent" && "*"}</label>
                            <input type="file" accept=".pdf" onChange={(e) => setDocuments({ ...documents, reraCertificate: e.target.files[0] })} required={details.individualType === "agent"} />
                        </div>
                        <div className="pro-field">
                            <label>Financial Model {details.individualType === "agent" && "*"}</label>
                            <input type="file" accept=".pdf" onChange={(e) => setDocuments({ ...documents, financialModel: e.target.files[0] })} required={details.individualType === "agent"} />
                        </div>
                    </div>
                </div>

                <div className="pro-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Processing Application..." : "Submit Funding Request"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Property;