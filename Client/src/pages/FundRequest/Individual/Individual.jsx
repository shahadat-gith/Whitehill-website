import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../../Context/AppContext";
import StepProgress from "../components/StepProgress";
import LocationStep from "../components/LocationStep";
import SubmitReview from "../components/SubmitReview";
import Step1RequestSummary from "./Steps/Step1RequestSummary";
import Step3ProjectDetails from "./Steps/Step3ProjectDetails";
import Step4CostDetails from "./Steps/Step4CostDetails";
import Step5RiskDisclosure from "./Steps/Step5RiskDisclosure";
import Step6Documents from "./Steps/Step6Documents";
import "../FundRequest.css";
import "./Individual.css";

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

const Individual = () => {
    const { user } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const TOTAL_STEPS = 6;
    const STORAGE_KEY = "individualFundRequest";

    const stepTitles = [
        "Fund Details",
        "Location",
        "Project Details",
        "Cost Details",
        "Risk Disclosure",
        "Documents"
    ];

    // Parse step from URL - support both numeric steps and 'submit'
    const stepParam = searchParams.get("step") || "1";
    const currentStep = stepParam === "submit" ? TOTAL_STEPS + 1 : parseInt(stepParam);

    const [amountRequested, setAmountRequested] = useState("");
    const [location, setLocation] = useState(initialLocation);
    const [details, setDetails] = useState(initialDetails);
    const [documents, setDocuments] = useState(initialDocs);
    const [submitting, setSubmitting] = useState(false);

    // Load data from sessionStorage on mount
    useEffect(() => {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setAmountRequested(parsed.amountRequested || "");
                setLocation(parsed.location || initialLocation);
                setDetails(parsed.details || initialDetails);
            } catch (error) {
                console.error("Error loading saved data:", error);
            }
        } else if (currentStep > 1) {
            // If on step > 1 but no saved data, reset to step 1
            const currentType = searchParams.get("type") || "individual";
            setSearchParams({ type: currentType, step: "1" });
        }
    }, []);

    // Save data to sessionStorage whenever it changes (excluding documents)
    useEffect(() => {
        const dataToSave = {
            amountRequested,
            location,
            details
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [amountRequested, location, details]);

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

    const goToStep = (step) => {
        // Allow step 7 (review page) even though TOTAL_STEPS is 6
        if (step >= 1 && step <= TOTAL_STEPS + 1) {
            const currentType = searchParams.get("type") || "individual";
            const stepValue = step === TOTAL_STEPS + 1 ? "submit" : step.toString();
            setSearchParams({ type: currentType, step: stepValue });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const nextStep = () => {
        if (currentStep <= TOTAL_STEPS) {
            goToStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    };

    const resetForm = () => {
        setAmountRequested("");
        setLocation(initialLocation);
        setDetails(initialDetails);
        setDocuments(initialDocs);
        sessionStorage.removeItem(STORAGE_KEY);
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
            formData.append("amountRequested", amountRequested);
            formData.append("location", JSON.stringify(location));
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

            toast.success("Individual fund request submitted successfully!");
            
            // Clear session storage and reset form state
            sessionStorage.removeItem(STORAGE_KEY);
            setAmountRequested("");
            setLocation(initialLocation);
            setDetails(initialDetails);
            setDocuments(initialDocs);
            
            // Navigate to profile and replace history to prevent back button issues
            navigate("/profile?tab=fund-requests", { replace: true });
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

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1RequestSummary
                        amountRequested={amountRequested}
                        setAmountRequested={setAmountRequested}
                    />
                );
            case 2:
                return (
                    <LocationStep
                        location={location}
                        handleLocationChange={handleLocationChange}
                    />
                );
            case 3:
                return (
                    <Step3ProjectDetails
                        details={details}
                        handleDetailChange={handleDetailChange}
                    />
                );
            case 4:
                return (
                    <Step4CostDetails
                        details={details}
                        handleCostChange={handleCostChange}
                    />
                );
            case 5:
                return (
                    <Step5RiskDisclosure
                        details={details}
                        handleRiskChange={handleRiskChange}
                    />
                );
            case 6:
                return (
                    <Step6Documents
                        documents={documents}
                        setDocuments={setDocuments}
                    />
                );
            case 7:
                return (
                    <SubmitReview
                        summaryData={
                            {
                                label: "Amount",
                                value: `₹${Number(amountRequested).toLocaleString("en-IN")}`,
                            }
                        }
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="ifr-container">
            <StepProgress 
                currentStep={currentStep} 
                totalSteps={TOTAL_STEPS} 
                stepTitles={stepTitles}
            />

            <form className="ifr-form" onSubmit={currentStep === 7 ? handleSubmit : (e) => { e.preventDefault(); }}>
                <div className="ifr-section">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="ifr-actions">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={prevStep}
                            disabled={currentStep === 7 && submitting}
                            style={{
                                background: "#e0e0e0",
                                color: "#333",
                            }}
                        >
                            <i className="fas fa-arrow-left"></i> Previous
                        </button>
                    )}

                    <button
                        type={currentStep === 7 ? "submit" : "button"}
                        className="btn btn-primary"
                        onClick={currentStep !== 7 ? nextStep : undefined}
                        disabled={currentStep === 7 && submitting}
                    >
                        {currentStep === 7 ? (
                            submitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Submitting...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i> Submit Application
                                </>
                            )
                        ) : currentStep === TOTAL_STEPS ? (
                            <>
                                Review & Submit <i className="fas fa-arrow-right"></i>
                            </>
                        ) : (
                            <>
                                Next <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Individual;
