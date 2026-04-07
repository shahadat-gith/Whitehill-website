import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../../Context/AppContext";
import "./Startup.css";

const initialLocation = {
    village: "", block: "", town: "", city: "", district: "",
    state: "", po: "", ps: "", pincode: "", googleMapLocation: "",
};

const initialDetails = {
    name: "",
    sector: "",
    description: "",
    stage: "idea",
    teamSize: "",
    foundationYear: "",
    currentRevenue: "",
    website: "",
    foundingTeam: [
        { name: "", role: "", equityStake: "", linkedinProfile: "" },
    ],
    businessModel: {
        problemDescription: "",
        solutionDescription: "",
        productDescription: "",
        targetCustomer: "",
        revenueModel: "",
        currentTraction: "revenue",
    },
    fundingType: "equity",
    fundUsageBreakdown: "",
    keyRisks: "",
};

const initialDocs = {
    projectionStatements: null, legalDocuments: null,
    pitchDeck: null, shareHoldingPattern: null,
};

const Startup = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    const [amountRequested, setAmountRequested] = useState("");
    const [location, setLocation] = useState(initialLocation);
    const [details, setDetails] = useState(initialDetails);
    const [documents, setDocuments] = useState(initialDocs);
    const [submitting, setSubmitting] = useState(false);

    // --- HANDLERS ---
    const handleFoundingTeamChange = (index, field, value) => {
        const updated = [...details.foundingTeam];
        updated[index] = { ...updated[index], [field]: value };
        setDetails({ ...details, foundingTeam: updated });
    };

    const addTeamMember = () => {
        setDetails({
            ...details,
            foundingTeam: [...details.foundingTeam, { name: "", role: "", equityStake: "", linkedinProfile: "" }]
        });
    };

    const removeTeamMember = (index) => {
        setDetails({
            ...details,
            foundingTeam: details.foundingTeam.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?._id) return toast.error("Please login to submit a fund request");
        
        // Basic Client-side check for Equity
        const totalEquity = details.foundingTeam.reduce((sum, m) => sum + Number(m.equityStake || 0), 0);
        if (totalEquity > 100) return toast.error("Total equity stake cannot exceed 100%");

        if (submitting) return;

        try {
            setSubmitting(true);
            const formData = new FormData();
            
            // Append Top-Level Fields
            formData.append("name", details.name);
            formData.append("sector", details.sector);
            formData.append("description", details.description);
            formData.append("stage", details.stage);
            formData.append("teamSize", Number(details.teamSize));
            formData.append("foundationYear", Number(details.foundationYear));
            formData.append("amountRequested", Number(amountRequested));
            formData.append("currentRevenue", Number(details.currentRevenue) || 0);
            formData.append("website", details.website || "");
            formData.append("fundingType", details.fundingType);
            formData.append("fundUsageBreakdown", details.fundUsageBreakdown);
            formData.append("keyRisks", details.keyRisks);

            // Append Object/Array Fields as JSON Strings
            formData.append("foundingTeam", JSON.stringify(details.foundingTeam));
            formData.append("businessModel", JSON.stringify(details.businessModel));
            formData.append("location", JSON.stringify(location));

            // Append Files
            Object.keys(documents).forEach(key => {
                if (documents[key]) formData.append(key, documents[key]);
            });

            const { data } = await api.post("/api/fund-request/startup", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                toast.success("Startup fund request submitted successfully!");
                navigate("/request-funds/congratulations", { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="sta-container">
            <header className="sta-header">
                <h1>Startup Funding Application</h1>
                <p>Provide comprehensive details to initiate the institutional review process.</p>
            </header>

            <form className="sta-form" onSubmit={handleSubmit}>
                {/* 1. FUNDING SUMMARY */}
                <div className="sta-section">
                    <h3 className="sta-section-title">1. Funding Summary</h3>
                    <div className="sta-grid sta-grid-2">
                        <div className="sta-field">
                            <label>Amount Requested (₹) *</label>
                            <input type="number" value={amountRequested} onChange={(e) => setAmountRequested(e.target.value)} placeholder="e.g., 5000000" required />
                        </div>
                        <div className="sta-field">
                            <label>Funding Type *</label>
                            <select value={details.fundingType} onChange={(e) => setDetails({ ...details, fundingType: e.target.value })} required>
                                <option value="equity">Equity</option>
                                <option value="profitSharing">Profit Sharing</option>
                                <option value="revenueSharing">Revenue Sharing</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. CORE DETAILS */}
                <div className="sta-section">
                    <h3 className="sta-section-title">2. Startup Core</h3>
                    <div className="sta-grid sta-grid-2">
                        <div className="sta-field">
                            <label>Startup Name *</label>
                            <input type="text" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} required />
                        </div>
                        <div className="sta-field">
                            <label>Sector *</label>
                            <input type="text" value={details.sector} onChange={(e) => setDetails({ ...details, sector: e.target.value })} required />
                        </div>
                    </div>
                    <div className="sta-field">
                        <label>Full Description *</label>
                        <textarea rows="3" value={details.description} onChange={(e) => setDetails({ ...details, description: e.target.value })} required />
                    </div>
                    <div className="sta-grid sta-grid-4">
                        <div className="sta-field">
                            <label>Stage *</label>
                            <select value={details.stage} onChange={(e) => setDetails({ ...details, stage: e.target.value })}>
                                <option value="idea">Idea</option>
                                <option value="mvp">MVP</option>
                                <option value="growth">Growth</option>
                                <option value="scale">Scale</option>
                            </select>
                        </div>
                        <div className="sta-field">
                            <label>Team Size *</label>
                            <input type="number" value={details.teamSize} onChange={(e) => setDetails({ ...details, teamSize: e.target.value })} required />
                        </div>
                        <div className="sta-field">
                            <label>Foundation Year *</label>
                            <input type="number" value={details.foundationYear} onChange={(e) => setDetails({ ...details, foundationYear: e.target.value })} required />
                        </div>
                        <div className="sta-field">
                            <label>Current Revenue (₹)</label>
                            <input type="number" value={details.currentRevenue} onChange={(e) => setDetails({ ...details, currentRevenue: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* 3. BUSINESS MODEL & TRACTION */}
                <div className="sta-section">
                    <h3 className="sta-section-title">3. Business Model & Strategy</h3>
                    <div className="sta-grid sta-grid-2">
                        <div className="sta-field">
                            <label>Problem Description *</label>
                            <textarea rows="3" value={details.businessModel.problemDescription} onChange={(e) => setDetails({ ...details, businessModel: { ...details.businessModel, problemDescription: e.target.value } })} required />
                        </div>
                        <div className="sta-field">
                            <label>Solution Description *</label>
                            <textarea rows="3" value={details.businessModel.solutionDescription} onChange={(e) => setDetails({ ...details, businessModel: { ...details.businessModel, solutionDescription: e.target.value } })} required />
                        </div>
                    </div>
                    <div className="sta-grid sta-grid-2">
                        <div className="sta-field">
                            <label>Product Description *</label>
                            <textarea rows="3" value={details.businessModel.productDescription} onChange={(e) => setDetails({ ...details, businessModel: { ...details.businessModel, productDescription: e.target.value } })} required />
                        </div>
                        <div className="sta-field">
                            <label>Target Customer *</label>
                            <textarea rows="3" value={details.businessModel.targetCustomer} onChange={(e) => setDetails({ ...details, businessModel: { ...details.businessModel, targetCustomer: e.target.value } })} required />
                        </div>
                    </div>
                    <div className="sta-grid sta-grid-2">
                        <div className="sta-field">
                            <label>Revenue Model *</label>
                            <textarea rows="2" value={details.businessModel.revenueModel} onChange={(e) => setDetails({ ...details, businessModel: { ...details.businessModel, revenueModel: e.target.value } })} required />
                        </div>
                        <div className="sta-field">
                            <label>Current Traction *</label>
                            <select value={details.businessModel.currentTraction} onChange={(e) => setDetails({ ...details, businessModel: { ...details.businessModel, currentTraction: e.target.value } })}>
                                <option value="revenue">Revenue</option>
                                <option value="user_growth">User Growth</option>
                                <option value="engagement_and_return">Engagement</option>
                                <option value="strategic_partnerships">Partnerships</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. EXECUTION PLAN */}
                <div className="sta-section">
                    <h3 className="sta-section-title">4. Risks & Fund Usage</h3>
                    <div className="sta-field">
                        <label>Fund Usage Breakdown *</label>
                        <textarea rows="3" value={details.fundUsageBreakdown} onChange={(e) => setDetails({ ...details, fundUsageBreakdown: e.target.value })} placeholder="How will you spend the requested amount?" required />
                    </div>
                    <div className="sta-field">
                        <label>Key Risks *</label>
                        <textarea rows="2" value={details.keyRisks} onChange={(e) => setDetails({ ...details, keyRisks: e.target.value })} placeholder="What are the major threats to your startup?" required />
                    </div>
                </div>

                {/* 5. TEAM */}
                <div className="sta-section">
                    <h3 className="sta-section-title">5. Founding Team</h3>
                    {details.foundingTeam.map((member, index) => (
                        <div className="sta-team-card" key={index}>
                            <div className="sta-team-card-header">
                                <span>Member {index + 1}</span>
                                {details.foundingTeam.length > 1 && (
                                    <button type="button" className="sta-remove-btn" onClick={() => removeTeamMember(index)}>✕</button>
                                )}
                            </div>
                            <div className="sta-grid sta-grid-2">
                                <div className="sta-field"><label>Name *</label><input type="text" value={member.name} onChange={(e) => handleFoundingTeamChange(index, "name", e.target.value)} required /></div>
                                <div className="sta-field"><label>Role *</label><input type="text" value={member.role} onChange={(e) => handleFoundingTeamChange(index, "role", e.target.value)} required /></div>
                                <div className="sta-field"><label>Equity % *</label><input type="number" value={member.equityStake} onChange={(e) => handleFoundingTeamChange(index, "equityStake", e.target.value)} required /></div>
                                <div className="sta-field"><label>LinkedIn</label><input type="url" value={member.linkedinProfile} onChange={(e) => handleFoundingTeamChange(index, "linkedinProfile", e.target.value)} /></div>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary" onClick={addTeamMember}>+ Add Member</button>
                </div>

                {/* 6. LOCATION */}
                <div className="sta-section">
                    <h3 className="sta-section-title">6. Operating Location</h3>
                    <div className="sta-grid sta-grid-3">
                        <div className="sta-field"><label>City *</label><input type="text" value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} required /></div>
                        <div className="sta-field"><label>District *</label><input type="text" value={location.district} onChange={(e) => setLocation({ ...location, district: e.target.value })} required /></div>
                        <div className="sta-field"><label>State *</label><input type="text" value={location.state} onChange={(e) => setLocation({ ...location, state: e.target.value })} required /></div>
                    </div>
                    <div className="sta-grid sta-grid-2" style={{marginTop: '10px'}}>
                        <div className="sta-field"><label>PIN Code *</label><input type="text" value={location.pincode} onChange={(e) => setLocation({ ...location, pincode: e.target.value })} required /></div>
                        <div className="sta-field"><label>Google Maps Link</label><input type="url" value={location.googleMapLocation} onChange={(e) => setLocation({ ...location, googleMapLocation: e.target.value })} /></div>
                    </div>
                </div>

                {/* 7. DOCUMENTS */}
                <div className="sta-section">
                    <h3 className="sta-section-title">7. Required Documents (PDF)</h3>
                    <div className="sta-grid sta-grid-2">
                        {['pitchDeck', 'projectionStatements', 'legalDocuments', 'shareHoldingPattern'].map((docKey) => (
                            <div className="sta-field" key={docKey}>
                                <label>{docKey.replace(/([A-Z])/g, ' $1').toUpperCase()} *</label>
                                <div className="sta-file-upload">
                                    <input type="file" accept=".pdf" id={docKey} onChange={(e) => setDocuments({ ...documents, [docKey]: e.target.files[0] })} required />
                                    <label htmlFor={docKey} className="sta-file-label">
                                        <span>{documents[docKey] ? documents[docKey].name : "Upload PDF"}</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sta-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Submitting Application..." : "Submit Funding Request"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Startup;