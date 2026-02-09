import React, { useState } from "react";
import api from "../../Configs/axios";
import toast from "react-hot-toast";
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

const BusinessFundRequest = () => {
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

	const handleBusinessPartnerChange = (index, field, value) => {
		setDetails((prev) => {
			const updated = [...prev.businessPartners];
			updated[index] = { ...updated[index], [field]: value };
			return { ...prev, businessPartners: updated };
		});
	};

	const addBusinessPartner = () => {
		setDetails((prev) => ({
			...prev,
			businessPartners: [
				...prev.businessPartners,
				{ name: "", role: "", share: "" },
			],
		}));
	};

	const removeBusinessPartner = (index) => {
		setDetails((prev) => ({
			...prev,
			businessPartners: prev.businessPartners.filter((_, idx) => idx !== index),
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
			formData.append("stage", details.stage);
			formData.append("name", details.name);
			formData.append("industry", details.industry);
			formData.append("businessModel", details.businessModel);
			formData.append("description", details.description);
			formData.append("teamSize", details.teamSize);
			formData.append("website", details.website || "");
			formData.append("turnOver", details.turnOver || 0);
			formData.append("profitMargin", details.profitMargin);
			formData.append("outStandingLoan", details.outStandingLoan || 0);
			formData.append("purpose", JSON.stringify(details.purpose));
			formData.append("fundingType", details.fundingType);
			formData.append("riskDisclosure", JSON.stringify(details.riskDisclosure));
			formData.append("businessPartners", JSON.stringify(details.businessPartners));
			formData.append("location", JSON.stringify(location));
			formData.append("amountRequested", amountRequested);

			formData.append("businessPlan", documents.businessPlan);
			formData.append("bankStatements", documents.bankStatements);
			formData.append("financialStatements", documents.financialStatements);
			formData.append("gstReturns", documents.gstReturns);
			formData.append("legalDocuments", documents.legalDocuments);
			formData.append("cashFlowStatement", documents.cashFlowStatement);

			const { data } = await api.post("/api/fund-request/business", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (!data.success) {
				throw new Error(data.message || "Failed to submit request");
			}

			toast.success("Business fund request submitted");
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
		<form className="fund-request-form" onSubmit={handleSubmit}>
			<div className="fund-card">
				<h2>Request Summary</h2>
				<div className="fund-grid">
					<div className="fund-field">
						<label>Amount Requested *</label>
						<input
							type="number"
							value={amountRequested}
							onChange={(event) => setAmountRequested(event.target.value)}
							placeholder="Enter amount"
							required
						/>
					</div>
					<div className="fund-field">
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

			<div className="fund-card">
				<h2>Location</h2>
				<div className="fund-grid">
					<div className="fund-field">
						<label>City *</label>
						<input
							type="text"
							value={location.city}
							onChange={(event) =>
								handleLocationChange("city", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>District *</label>
						<input
							type="text"
							value={location.district}
							onChange={(event) =>
								handleLocationChange("district", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>State *</label>
						<input
							type="text"
							value={location.state}
							onChange={(event) =>
								handleLocationChange("state", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Pincode *</label>
						<input
							type="text"
							value={location.pincode}
							onChange={(event) =>
								handleLocationChange("pincode", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Village</label>
						<input
							type="text"
							value={location.village}
							onChange={(event) =>
								handleLocationChange("village", event.target.value)
							}
						/>
					</div>
					<div className="fund-field">
						<label>Block</label>
						<input
							type="text"
							value={location.block}
							onChange={(event) =>
								handleLocationChange("block", event.target.value)
							}
						/>
					</div>
					<div className="fund-field">
						<label>Town</label>
						<input
							type="text"
							value={location.town}
							onChange={(event) =>
								handleLocationChange("town", event.target.value)
							}
						/>
					</div>
					<div className="fund-field">
						<label>Post Office</label>
						<input
							type="text"
							value={location.po}
							onChange={(event) => handleLocationChange("po", event.target.value)}
						/>
					</div>
					<div className="fund-field">
						<label>Police Station</label>
						<input
							type="text"
							value={location.ps}
							onChange={(event) => handleLocationChange("ps", event.target.value)}
						/>
					</div>
					<div className="fund-field full">
						<label>Google Maps Link</label>
						<input
							type="text"
							value={location.googleMapLocation}
							onChange={(event) =>
								handleLocationChange("googleMapLocation", event.target.value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="fund-card">
				<h2>Business Venture Details</h2>
				<div className="fund-grid">
					<div className="fund-field">
						<label>Business Name *</label>
						<input
							type="text"
							value={details.name}
							onChange={(event) =>
								handleDetailChange("name", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Industry *</label>
						<input
							type="text"
							value={details.industry}
							onChange={(event) =>
								handleDetailChange("industry", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
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
					<div className="fund-field">
						<label>Team Size *</label>
						<input
							type="number"
							value={details.teamSize}
							onChange={(event) =>
								handleDetailChange("teamSize", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Turnover</label>
						<input
							type="number"
							value={details.turnOver}
							onChange={(event) =>
								handleDetailChange("turnOver", event.target.value)
							}
						/>
					</div>
					<div className="fund-field">
						<label>Profit Margin *</label>
						<input
							type="text"
							value={details.profitMargin}
							onChange={(event) =>
								handleDetailChange("profitMargin", event.target.value)
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Outstanding Loan</label>
						<input
							type="number"
							value={details.outStandingLoan}
							onChange={(event) =>
								handleDetailChange("outStandingLoan", event.target.value)
							}
						/>
					</div>
					<div className="fund-field">
						<label>Website</label>
						<input
							type="text"
							value={details.website}
							onChange={(event) =>
								handleDetailChange("website", event.target.value)
							}
						/>
					</div>
				</div>

				<div className="fund-field full">
					<label>Business Model *</label>
					<textarea
						rows="3"
						value={details.businessModel}
						onChange={(event) =>
							handleDetailChange("businessModel", event.target.value)
						}
						required
					></textarea>
				</div>
				<div className="fund-field full">
					<label>Description *</label>
					<textarea
						rows="4"
						value={details.description}
						onChange={(event) =>
							handleDetailChange("description", event.target.value)
						}
						required
					></textarea>
				</div>

				<div className="fund-section">
					<h3>Purpose</h3>
					<div className="fund-checkboxes">
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
							Expansion
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
						<label>
							Other
							<input
								type="text"
								value={details.purpose.other}
								onChange={(event) =>
									handlePurposeChange("other", event.target.value)
								}
							/>
						</label>
					</div>
				</div>

				<div className="fund-section">
					<h3>Risk Disclosure</h3>
					<div className="fund-grid">
						<div className="fund-field">
							<label>Regulatory Risks *</label>
							<textarea
								rows="2"
								value={details.riskDisclosure.regulatoryRisks}
								onChange={(event) =>
									handleRiskChange("regulatoryRisks", event.target.value)
								}
								required
							></textarea>
						</div>
						<div className="fund-field">
							<label>Market Risks *</label>
							<textarea
								rows="2"
								value={details.riskDisclosure.marketRisks}
								onChange={(event) =>
									handleRiskChange("marketRisks", event.target.value)
								}
								required
							></textarea>
						</div>
						<div className="fund-field">
							<label>Seasonality Risks *</label>
							<textarea
								rows="2"
								value={details.riskDisclosure.seasonalityRisks}
								onChange={(event) =>
									handleRiskChange("seasonalityRisks", event.target.value)
								}
								required
							></textarea>
						</div>
						<div className="fund-field">
							<label>Operational Risks *</label>
							<textarea
								rows="2"
								value={details.riskDisclosure.operationalRisks}
								onChange={(event) =>
									handleRiskChange("operationalRisks", event.target.value)
								}
								required
							></textarea>
						</div>
						<div className="fund-field">
							<label>Dependency Risks *</label>
							<textarea
								rows="2"
								value={details.riskDisclosure.dependencyRisks}
								onChange={(event) =>
									handleRiskChange("dependencyRisks", event.target.value)
								}
								required
							></textarea>
						</div>
					</div>
				</div>

				<div className="fund-section">
					<h3>Business Partners</h3>
					{details.businessPartners.map((partner, index) => (
						<div className="fund-inline" key={`partner-${index}`}>
							<input
								type="text"
								placeholder="Name"
								value={partner.name}
								onChange={(event) =>
									handleBusinessPartnerChange(index, "name", event.target.value)
								}
								required
							/>
							<input
								type="text"
								placeholder="Role"
								value={partner.role}
								onChange={(event) =>
									handleBusinessPartnerChange(index, "role", event.target.value)
								}
								required
							/>
							<input
								type="number"
								placeholder="Share %"
								value={partner.share}
								onChange={(event) =>
									handleBusinessPartnerChange(index, "share", event.target.value)
								}
								required
							/>
							{details.businessPartners.length > 1 && (
								<button
									type="button"
									className="fund-icon-btn"
									onClick={() => removeBusinessPartner(index)}
								>
									<i className="fas fa-times"></i>
								</button>
							)}
						</div>
					))}
					<button
						type="button"
						className="fund-add-btn"
						onClick={addBusinessPartner}
					>
						<i className="fas fa-plus"></i> Add Partner
					</button>
				</div>

				<h3>Business Documents</h3>
				<div className="fund-grid">
					<div className="fund-field">
						<label>Business Plan *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									businessPlan: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Bank Statements *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									bankStatements: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Financial Statements *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									financialStatements: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>GST Returns *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									gstReturns: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Legal Documents *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									legalDocuments: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Cash Flow Statement *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									cashFlowStatement: event.target.files[0],
								}))
							}
							required
						/>
					</div>
				</div>
			</div>

			<div className="fund-actions">

				<button type="submit" className="btn btn-primary" disabled={submitting}>
					{submitting ? "Submitting..." : "Submit Request"}
				</button>
			</div>
		</form>
	);
};

export default BusinessFundRequest;
