import React, { useState } from "react";
import api from "../../Configs/axios";
import toast from "react-hot-toast";
import "./Styles/StartupFundRequest.css"
import { useAppContext } from "../../Context/AppContext";

const initialLocation = {
    village: "",
    block: "",
    town: "",
    city: "",
    district: "",
    state: "",
    po: "",
    ps: "",
    pincode: "",
    googleMapLocation: "",
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
    foundingTeam: [{ name: "", role: "", equityStake: "", linkedinProfile: "" }],
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
    projectionStatements: null,
    legalDocuments: null,
    pitchDeck: null,
    shareHoldingPattern: null,
};

const StartupFundRequest = () => {
    const { user } = useAppContext();

    const [amountRequested, setAmountRequested] = useState("");
    const [location, setLocation] = useState(initialLocation);
    const [details, setDetails] = useState(initialDetails);
    const [documents, setDocuments] = useState(initialDocs);
    const [submitting, setSubmitting] = useState(false);

    const handleLocationChange = (field, value) => {
        setLocation((prev) => ({ ...prev, [field]: value }));
    };

    const handleDetailChange = (field, value) => {
        setDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleBusinessModelChange = (field, value) => {
        setDetails((prev) => ({
            ...prev,
            businessModel: { ...prev.businessModel, [field]: value },
        }));
    };

    const handleFoundingTeamChange = (index, field, value) => {
        setDetails((prev) => {
            const updated = [...prev.foundingTeam];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, foundingTeam: updated };
        });
    };

    const addFoundingTeamMember = () => {
        setDetails((prev) => ({
            ...prev,
            foundingTeam: [
                ...prev.foundingTeam,
                { name: "", role: "", equityStake: "", linkedinProfile: "" },
            ],
        }));
    };

    const removeFoundingTeamMember = (index) => {
        setDetails((prev) => ({
            ...prev,
            foundingTeam: prev.foundingTeam.filter((_, idx) => idx !== index),
        }));
    };

    const resetForm = () => {
        setAmountRequested("");
        setLocation(initialLocation);
        setDetails(initialDetails);
        setDocuments(initialDocs);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user?._id) {
            toast.error("Please login to submit a fund request");
            return;
        }

        if (submitting) return;

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("name", details.name);
            formData.append("sector", details.sector);
            formData.append("description", details.description);
            formData.append("stage", details.stage);
            formData.append("teamSize", details.teamSize);
            formData.append("foundationYear", details.foundationYear);
            formData.append("currentRevenue", details.currentRevenue || 0);
            formData.append("website", details.website || "");
            formData.append("foundingTeam", JSON.stringify(details.foundingTeam));
            formData.append("businessModel", JSON.stringify(details.businessModel));
            formData.append("fundingType", details.fundingType);
            formData.append("fundUsageBreakdown", details.fundUsageBreakdown);
            formData.append("keyRisks", details.keyRisks);
            formData.append("location", JSON.stringify(location));
            formData.append("amountRequested", amountRequested);

            formData.append("projectionStatements", documents.projectionStatements);
            formData.append("legalDocuments", documents.legalDocuments);
            formData.append("pitchDeck", documents.pitchDeck);
            formData.append("shareHoldingPattern", documents.shareHoldingPattern);

            const { data } = await api.post("/api/fund-request/startup", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (!data.success) {
                throw new Error(data.message || "Failed to submit request");
            }

            toast.success("Startup fund request submitted");
            resetForm();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to submit request"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="sfr-container">


            <form className="sfr-form" onSubmit={handleSubmit}>
                {/* Section 1: Request Summary */}
                <section className="sfr-section">
                    <div className="sfr-section-header">
                        <div className="sfr-section-number">01</div>
                        <div className="sfr-section-title">
                            <h2>Request Summary</h2>
                            <p>Basic funding requirements and investment type</p>
                        </div>
                    </div>
                    <div className="sfr-section-content">
                        <div className="sfr-grid sfr-grid-2">
                            <div className="sfr-field">
                                <label>Amount Requested *</label>
                                <input
                                    type="number"
                                    value={amountRequested}
                                    onChange={(e) => setAmountRequested(e.target.value)}
                                    placeholder="₹ 50,00,000"
                                    required
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Funding Type *</label>
                                <select
                                    value={details.fundingType}
                                    onChange={(e) =>
                                        handleDetailChange("fundingType", e.target.value)
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

                {/* Section 2: Startup Details */}
                <section className="sfr-section">
                    <div className="sfr-section-header">
                        <div className="sfr-section-number">02</div>
                        <div className="sfr-section-title">
                            <h2>Startup Details</h2>
                            <p>Core information about your startup and fund utilization</p>
                        </div>
                    </div>
                    <div className="sfr-section-content">
                        <div className="sfr-grid sfr-grid-2">
                            <div className="sfr-field">
                                <label>Startup Name *</label>
                                <input
                                    type="text"
                                    value={details.name}
                                    onChange={(e) =>
                                        handleDetailChange("name", e.target.value)
                                    }
                                    placeholder="e.g., TechVenture Solutions"
                                    required
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Sector *</label>
                                <input
                                    type="text"
                                    value={details.sector}
                                    onChange={(e) =>
                                        handleDetailChange("sector", e.target.value)
                                    }
                                    placeholder="e.g., FinTech, EdTech, HealthTech, AgriTech"
                                    required
                                />
                            </div>
                        </div>

                        <div className="sfr-field">
                            <label>Startup Description *</label>
                            <textarea
                                rows="4"
                                value={details.description}
                                onChange={(e) =>
                                    handleDetailChange("description", e.target.value)
                                }
                                placeholder="Provide a comprehensive overview of your startup. Include what your company does, the industry you operate in, your unique value proposition, and what sets you apart from competitors. (Min 100 words recommended)"
                                required
                            ></textarea>
                        </div>

                        <div className="sfr-grid sfr-grid-3">
                            <div className="sfr-field">
                                <label>Current Stage *</label>
                                <select
                                    value={details.stage}
                                    onChange={(e) =>
                                        handleDetailChange("stage", e.target.value)
                                    }
                                >
                                    <option value="idea">Idea Stage</option>
                                    <option value="mvp">MVP Developed</option>
                                    <option value="growth">Growth Stage</option>
                                    <option value="scale">Scaling</option>
                                </select>
                            </div>
                            <div className="sfr-field">
                                <label>Team Size *</label>
                                <input
                                    type="number"
                                    value={details.teamSize}
                                    onChange={(e) =>
                                        handleDetailChange("teamSize", e.target.value)
                                    }
                                    placeholder="e.g., 8"
                                    required
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Foundation Year *</label>
                                <input
                                    type="number"
                                    value={details.foundationYear}
                                    onChange={(e) =>
                                        handleDetailChange("foundationYear", e.target.value)
                                    }
                                    placeholder="2023"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    required
                                />
                            </div>
                        </div>

                        <div className="sfr-grid sfr-grid-2">
                            <div className="sfr-field">
                                <label>Current Annual Revenue</label>
                                <input
                                    type="number"
                                    value={details.currentRevenue}
                                    onChange={(e) =>
                                        handleDetailChange("currentRevenue", e.target.value)
                                    }
                                    placeholder="₹ 15,00,000 (Leave blank if pre-revenue)"
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Website URL</label>
                                <input
                                    type="url"
                                    value={details.website}
                                    onChange={(e) =>
                                        handleDetailChange("website", e.target.value)
                                    }
                                    placeholder="https://www.yourcompany.com"
                                />
                            </div>
                        </div>

                        <div className="sfr-divider"></div>

                        <div className="sfr-grid sfr-grid-2">
                            <div className="sfr-field">
                                <label>Fund Usage Breakdown *</label>
                                <textarea
                                    rows="15"
                                    value={details.fundUsageBreakdown}
                                    onChange={(e) =>
                                        handleDetailChange("fundUsageBreakdown", e.target.value)
                                    }
                                    placeholder="Provide a detailed breakdown of how you plan to allocate the requested funds. Example:
- Product Development - 40% (₹20L) - Hiring 2 developers, UI/UX improvements
- Marketing & Sales - 30% (₹15L) - Digital marketing campaigns, sales team expansion
- Operations - 20% (₹10L) - Office setup, infrastructure, licenses
- Working Capital - 10% (₹5L) - Day-to-day expenses for 6 months"
                                    required
                                ></textarea>
                            </div>
                            <div className="sfr-field">
                                <label>Key Risks & Mitigation Strategies *</label>
                                <textarea
                                    rows="15"
                                    value={details.keyRisks}
                                    onChange={(e) =>
                                        handleDetailChange("keyRisks", e.target.value)
                                    }
                                    placeholder="Identify potential risks and how you plan to address them. Example:
- Market Risk - Competition from established players
  Mitigation: Focus on niche segment, superior customer service
- Technology Risk - Dependency on third-party APIs
  Mitigation: Building backup systems, diversifying vendors
- Financial Risk - Extended customer payment cycles
  Mitigation: Maintaining 6-month runway, flexible pricing
- Team Risk - Key person dependency
  Mitigation: Cross-training, documented processes"
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Business Model */}
                <section className="sfr-section">
                    <div className="sfr-section-header">
                        <div className="sfr-section-number">03</div>
                        <div className="sfr-section-title">
                            <h2>Business Model</h2>
                            <p>Your solution, target market, and revenue strategy</p>
                        </div>
                    </div>
                    <div className="sfr-section-content">
                        <div className="sfr-grid sfr-grid-2">
                            <div className="sfr-field">
                                <label>Problem Statement *</label>
                                <textarea
                                    rows="15"
                                    value={details.businessModel.problemDescription}
                                    onChange={(e) =>
                                        handleBusinessModelChange(
                                            "problemDescription",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe the specific problem or pain point you're addressing. Be clear about:
- Who faces this problem?
- How significant is the problem?
- What are the current consequences of this problem?
- Why hasn't it been solved effectively before?

Example: Small businesses struggle with inventory management, leading to 30% stockouts and ₹5L average annual losses per business due to lack of affordable, easy-to-use solutions."
                                    required
                                ></textarea>
                            </div>
                            <div className="sfr-field">
                                <label>Your Solution *</label>
                                <textarea
                                    rows="15"
                                    value={details.businessModel.solutionDescription}
                                    onChange={(e) =>
                                        handleBusinessModelChange(
                                            "solutionDescription",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Explain how your startup solves the identified problem. Include:
- What is your approach/methodology?
- Why is your solution better than alternatives?
- What makes it unique or innovative?
- What results have you achieved so far?

Example: Our AI-powered inventory system provides real-time tracking, automated reordering, and predictive analytics at 1/10th the cost of enterprise solutions, reducing stockouts by 85%."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="sfr-field">
                            <label>Product/Service Description *</label>
                            <textarea
                                rows="12"
                                value={details.businessModel.productDescription}
                                onChange={(e) =>
                                    handleBusinessModelChange(
                                        "productDescription",
                                        e.target.value
                                    )
                                }
                                placeholder="Provide detailed information about your product or service:
- Key features and functionalities
- Technology stack (if applicable)
- Development stage and roadmap
- Unique selling propositions
- Any patents, IP, or proprietary technology

Example: SaaS platform with mobile app, barcode scanning, supplier integration, AI-based demand forecasting, customizable alerts, and real-time analytics dashboard. Built on React, Node.js, and TensorFlow."
                                required
                            ></textarea>
                        </div>

                        <div className="sfr-grid sfr-grid-3">
                            <div className="sfr-field">
                                <label>Target Customer Segment *</label>
                                <input
                                    type="text"
                                    value={details.businessModel.targetCustomer}
                                    onChange={(e) =>
                                        handleBusinessModelChange(
                                            "targetCustomer",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., SMB retailers with 5-50 employees in Tier 2/3 cities"
                                    required
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Revenue Model *</label>
                                <input
                                    type="text"
                                    value={details.businessModel.revenueModel}
                                    onChange={(e) =>
                                        handleBusinessModelChange(
                                            "revenueModel",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., SaaS subscription (₹2999/month), Transaction fees (2%)"
                                    required
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Current Traction Metric *</label>
                                <select
                                    value={details.businessModel.currentTraction}
                                    onChange={(e) =>
                                        handleBusinessModelChange(
                                            "currentTraction",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="revenue">Revenue Generation</option>
                                    <option value="user_growth">User/Customer Growth</option>
                                    <option value="engagement_and_return">
                                        User Engagement & Retention
                                    </option>
                                    <option value="strategic_partnerships">
                                        Strategic Partnerships
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Founding Team */}
                <section className="sfr-section">
                    <div className="sfr-section-header">
                        <div className="sfr-section-number">04</div>
                        <div className="sfr-section-title">
                            <h2>Founding Team</h2>
                            <p>Information about your core team members and their roles</p>
                        </div>
                    </div>
                    <div className="sfr-section-content">
                        <div className="sfr-team-list">
                            {details.foundingTeam.map((member, index) => (
                                <div className="sfr-team-card" key={`founder-${index}`}>
                                    <div className="sfr-team-card-header">
                                        <span className="sfr-team-badge">Founder {index + 1}</span>
                                        {details.foundingTeam.length > 1 && (
                                            <button
                                                type="button"
                                                className="sfr-remove-btn"
                                                onClick={() => removeFoundingTeamMember(index)}
                                                title="Remove team member"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        )}
                                    </div>
                                    <div className="sfr-team-card-content">
                                        <div className="sfr-grid sfr-grid-2">
                                            <div className="sfr-field">
                                                <label>Full Name *</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Rajesh Kumar"
                                                    value={member.name}
                                                    onChange={(e) =>
                                                        handleFoundingTeamChange(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="sfr-field">
                                                <label>Role/Designation *</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Co-Founder & CEO"
                                                    value={member.role}
                                                    onChange={(e) =>
                                                        handleFoundingTeamChange(
                                                            index,
                                                            "role",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="sfr-grid sfr-grid-2">
                                            <div className="sfr-field">
                                                <label>Equity Stake (%) *</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g., 35"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={member.equityStake}
                                                    onChange={(e) =>
                                                        handleFoundingTeamChange(
                                                            index,
                                                            "equityStake",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="sfr-field">
                                                <label>LinkedIn Profile</label>
                                                <input
                                                    type="url"
                                                    placeholder="https://linkedin.com/in/username"
                                                    value={member.linkedinProfile}
                                                    onChange={(e) =>
                                                        handleFoundingTeamChange(
                                                            index,
                                                            "linkedinProfile",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="sfr-add-btn"
                            onClick={addFoundingTeamMember}
                        >
                            <i className="fas fa-plus"></i> Add Another Founding Member
                        </button>
                    </div>
                </section>

                {/* Section 5: Documents */}
                <section className="sfr-section">
                    <div className="sfr-section-header">
                        <div className="sfr-section-number">05</div>
                        <div className="sfr-section-title">
                            <h2>Required Documents</h2>
                            <p>Upload all necessary documents for evaluation</p>
                        </div>
                    </div>
                    <div className="sfr-section-content">
                        <div className="sfr-grid sfr-grid-2">
                            <div className="sfr-field">
                                <label>Financial Projections *</label>
                                <div className="sfr-file-upload">
                                    <input
                                        type="file"
                                        accept=".pdf,.xlsx,.xls"
                                        onChange={(e) =>
                                            setDocuments((prev) => ({
                                                ...prev,
                                                projectionStatements: e.target.files[0],
                                            }))
                                        }
                                        required
                                        id="projectionStatements"
                                    />
                                    <label htmlFor="projectionStatements" className="sfr-file-label">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>
                                            {documents.projectionStatements
                                                ? documents.projectionStatements.name
                                                : "Upload 3-5 year financial projections (PDF/Excel)"}
                                        </span>
                                    </label>
                                </div>
                                <small>Include revenue, expenses, cash flow projections</small>
                            </div>

                            <div className="sfr-field">
                                <label>Legal Documents *</label>
                                <div className="sfr-file-upload">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) =>
                                            setDocuments((prev) => ({
                                                ...prev,
                                                legalDocuments: e.target.files[0],
                                            }))
                                        }
                                        required
                                        id="legalDocuments"
                                    />
                                    <label htmlFor="legalDocuments" className="sfr-file-label">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>
                                            {documents.legalDocuments
                                                ? documents.legalDocuments.name
                                                : "Upload incorporation certificate & GST (PDF)"}
                                        </span>
                                    </label>
                                </div>
                                <small>Certificate of Incorporation, GST, PAN</small>
                            </div>

                            <div className="sfr-field">
                                <label>Pitch Deck *</label>
                                <div className="sfr-file-upload">
                                    <input
                                        type="file"
                                        accept=".pdf,.ppt,.pptx"
                                        onChange={(e) =>
                                            setDocuments((prev) => ({
                                                ...prev,
                                                pitchDeck: e.target.files[0],
                                            }))
                                        }
                                        required
                                        id="pitchDeck"
                                    />
                                    <label htmlFor="pitchDeck" className="sfr-file-label">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>
                                            {documents.pitchDeck
                                                ? documents.pitchDeck.name
                                                : "Upload investor pitch deck (PDF/PPT)"}
                                        </span>
                                    </label>
                                </div>
                                <small>10-15 slides covering problem, solution, market, team</small>
                            </div>

                            <div className="sfr-field">
                                <label>Shareholding Pattern *</label>
                                <div className="sfr-file-upload">
                                    <input
                                        type="file"
                                        accept=".pdf,.xlsx,.xls"
                                        onChange={(e) =>
                                            setDocuments((prev) => ({
                                                ...prev,
                                                shareHoldingPattern: e.target.files[0],
                                            }))
                                        }
                                        required
                                        id="shareHoldingPattern"
                                    />
                                    <label htmlFor="shareHoldingPattern" className="sfr-file-label">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>
                                            {documents.shareHoldingPattern
                                                ? documents.shareHoldingPattern.name
                                                : "Upload cap table/shareholding details (PDF/Excel)"}
                                        </span>
                                    </label>
                                </div>
                                <small>Current equity distribution among stakeholders</small>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 6: Location */}
                <section className="sfr-section">
                    <div className="sfr-section-header">
                        <div className="sfr-section-number">06</div>
                        <div className="sfr-section-title">
                            <h2>Business Location</h2>
                            <p>Primary address where your startup operates</p>
                        </div>
                    </div>
                    <div className="sfr-section-content">
                        <div className="sfr-grid sfr-grid-3">
                            <div className="sfr-field">
                                <label>State *</label>
                                <input
                                    type="text"
                                    value={location.state}
                                    onChange={(e) =>
                                        handleLocationChange("state", e.target.value)
                                    }
                                    placeholder="e.g., Maharashtra"
                                    required
                                />
                            </div>
                            <div className="sfr-field">
                                <label>District *</label>
                                <input
                                    type="text"
                                    value={location.district}
                                    onChange={(e) =>
                                        handleLocationChange("district", e.target.value)
                                    }
                                    placeholder="e.g., Pune"
                                    required
                                />
                            </div>
                            <div className="sfr-field">
                                <label>City/Town *</label>
                                <input
                                    type="text"
                                    value={location.city}
                                    onChange={(e) =>
                                        handleLocationChange("city", e.target.value)
                                    }
                                    placeholder="e.g., Hinjewadi"
                                    required
                                />
                            </div>
                        </div>

                        <div className="sfr-grid sfr-grid-4">
                            <div className="sfr-field">
                                <label>Village</label>
                                <input
                                    type="text"
                                    value={location.village}
                                    onChange={(e) =>
                                        handleLocationChange("village", e.target.value)
                                    }
                                    placeholder="If applicable"
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Block</label>
                                <input
                                    type="text"
                                    value={location.block}
                                    onChange={(e) =>
                                        handleLocationChange("block", e.target.value)
                                    }
                                    placeholder="Block name"
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Town/Taluka</label>
                                <input
                                    type="text"
                                    value={location.town}
                                    onChange={(e) =>
                                        handleLocationChange("town", e.target.value)
                                    }
                                    placeholder="Taluka name"
                                />
                            </div>
                            <div className="sfr-field">
                                <label>PIN Code *</label>
                                <input
                                    type="text"
                                    value={location.pincode}
                                    onChange={(e) =>
                                        handleLocationChange("pincode", e.target.value)
                                    }
                                    placeholder="e.g., 411057"
                                    pattern="[0-9]{6}"
                                    maxLength="6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="sfr-grid sfr-grid-3">
                            <div className="sfr-field">
                                <label>Post Office</label>
                                <input
                                    type="text"
                                    value={location.po}
                                    onChange={(e) =>
                                        handleLocationChange("po", e.target.value)
                                    }
                                    placeholder="Nearest post office"
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Police Station</label>
                                <input
                                    type="text"
                                    value={location.ps}
                                    onChange={(e) =>
                                        handleLocationChange("ps", e.target.value)
                                    }
                                    placeholder="Nearest police station"
                                />
                            </div>
                            <div className="sfr-field">
                                <label>Google Maps Link</label>
                                <input
                                    type="url"
                                    value={location.googleMapLocation}
                                    onChange={(e) =>
                                        handleLocationChange("googleMapLocation", e.target.value)
                                    }
                                    placeholder="https://maps.app.goo.gl/..."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Actions */}
                <div className="sfr-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Submitting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i> Submit Application
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StartupFundRequest;