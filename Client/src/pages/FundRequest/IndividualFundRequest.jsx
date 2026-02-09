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
	category: "project_devlopment",
	individualType: "agent",
	projectType: "residential",
	rera: "",
	cost: {
		totalProjectCost: "",
		landCost: "",
		construCtionCost: "",
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

const IndividualFundRequest = () => {
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

	const handleCostChange = (field, value) => {
		setDetails((prev) => ({
			...prev,
			cost: { ...prev.cost, [field]: value },
		}));
	};

	const handleRiskChange = (field, value) => {
		setDetails((prev) => ({
			...prev,
			riskDisclosure: { ...prev.riskDisclosure, [field]: value },
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
			formData.append("category", details.category);
			formData.append("individualType", details.individualType);
			formData.append("projectType", details.projectType);
			formData.append("cost", JSON.stringify(details.cost));
			formData.append("riskDisclosure", JSON.stringify(details.riskDisclosure));
			formData.append("location", JSON.stringify(location));
			formData.append("amountRequested", amountRequested);
			formData.append("rera", details.rera);

			formData.append("landOwnershipProof", documents.landOwnershipProof);
			formData.append("layout", documents.layout);
			formData.append("reraCertificate", documents.reraCertificate);
			formData.append("financialModel", documents.financialModel);

			const { data } = await api.post("/api/fund-request/individual", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (!data.success) {
				throw new Error(data.message || "Failed to submit request");
			}

			toast.success("Individual fund request submitted");
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
				<h2>Individual Request Details</h2>
				<div className="fund-grid">
					<div className="fund-field">
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
					<div className="fund-field">
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
					<div className="fund-field">
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
							<option value="mixed">Mixed</option>
						</select>
					</div>
					<div className="fund-field">
						<label>RERA Number *</label>
						<input
							type="text"
							value={details.rera}
							onChange={(event) => handleDetailChange("rera", event.target.value)}
							required
						/>
					</div>
				</div>

				<div className="fund-section">
					<h3>Cost Details</h3>
					<div className="fund-grid">
						<div className="fund-field">
							<label>Total Project Cost *</label>
							<input
								type="number"
								value={details.cost.totalProjectCost}
								onChange={(event) =>
									handleCostChange("totalProjectCost", event.target.value)
								}
								required
							/>
						</div>
						<div className="fund-field">
							<label>Land Cost *</label>
							<input
								type="number"
								value={details.cost.landCost}
								onChange={(event) => handleCostChange("landCost", event.target.value)}
								required
							/>
						</div>
						<div className="fund-field">
							<label>Construction Cost *</label>
							<input
								type="number"
								value={details.cost.construCtionCost}
								onChange={(event) =>
									handleCostChange("construCtionCost", event.target.value)
								}
								required
							/>
						</div>
						<div className="fund-field">
							<label>Funding Already Deployed *</label>
							<input
								type="number"
								value={details.cost.fundingAlreadyDeployed}
								onChange={(event) =>
									handleCostChange("fundingAlreadyDeployed", event.target.value)
								}
								required
							/>
						</div>
					</div>
				</div>

				<div className="fund-section">
					<h3>Risk Disclosure</h3>
					<div className="fund-grid">
						<div className="fund-field">
							<label>Execution Risks *</label>
							<textarea
								rows="2"
								value={details.riskDisclosure.executionRisks}
								onChange={(event) =>
									handleRiskChange("executionRisks", event.target.value)
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
					</div>
				</div>

				<h3>Supporting Documents</h3>
				<div className="fund-grid">
					<div className="fund-field">
						<label>Land Ownership Proof *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									landOwnershipProof: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Layout *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									layout: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>RERA Certificate *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									reraCertificate: event.target.files[0],
								}))
							}
							required
						/>
					</div>
					<div className="fund-field">
						<label>Financial Model *</label>
						<input
							type="file"
							onChange={(event) =>
								setDocuments((prev) => ({
									...prev,
									financialModel: event.target.files[0],
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

export default IndividualFundRequest;
