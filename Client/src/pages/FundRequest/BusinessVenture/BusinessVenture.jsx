import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../../Context/AppContext";
import "../FundRequest.css";
import "./BusinessVenture.css"
import StepProgress from "../components/StepProgress";
import LocationStep from "../components/LocationStep";
import SubmitReview from "../components/SubmitReview";
import Step1RequestSummary from "./Steps/Step1RequestSummary";
import Step3BusinessDetails from "./Steps/Step3BusinessDetails";
import Step4RiskDisclosure from "./Steps/Step4RiskDisclosure";
import Step5BusinessPartners from "./Steps/Step5BusinessPartners";
import Step6Documents from "./Steps/Step6Documents";


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

const BusinessVenture = () => {
    const { user } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const TOTAL_STEPS = 6;
    const STORAGE_KEY = "businessVentureFundRequest";

    const stepTitles = [
        "Fund Details",
        "Business Details",
        "Risk Disclosure",
        "Business Partners",
        "Location",
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
            const currentType = searchParams.get("type") || "business-venture";
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

    const goToStep = (step) => {
        // Allow step 7 (review page) even though TOTAL_STEPS is 6
        if (step >= 1 && step <= TOTAL_STEPS + 1) {
            const currentType = searchParams.get("type") || "business-venture";
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

            toast.success("Business fund request submitted successfully!");
            
            // Clear session storage and reset form state
            sessionStorage.removeItem(STORAGE_KEY);
            setAmountRequested("");
            setLocation(initialLocation);
            setDetails(initialDetails);
            setDocuments(initialDocs);
            
            // Navigate to congratulations page and replace history
            navigate("/congratulations", { replace: true });
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
                        details={details}
                        handleDetailChange={handleDetailChange}
                    />
                );
            case 2:
                return (
                    <Step3BusinessDetails
                        details={details}
                        handleDetailChange={handleDetailChange}
                        handlePurposeChange={handlePurposeChange}
                    />
                );
            case 3:
                return (
                    <Step4RiskDisclosure
                        details={details}
                        handleRiskChange={handleRiskChange}
                    />
                );
            case 4:
                return (
                    <Step5BusinessPartners
                        details={details}
                        handleBusinessPartnerChange={handleBusinessPartnerChange}
                        addBusinessPartner={addBusinessPartner}
                        removeBusinessPartner={removeBusinessPartner}
                    />
                );
            case 5:
                return (
                    <LocationStep
                        location={location}
                        handleLocationChange={handleLocationChange}
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
        <div className="bfr-container">
            <StepProgress 
                currentStep={currentStep} 
                totalSteps={TOTAL_STEPS} 
                stepTitles={stepTitles}
            />

            <form className="bfr-form" onSubmit={currentStep === 7 ? handleSubmit : (e) => { e.preventDefault(); }}>
                <div className="bfr-section">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="bfr-actions">
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

export default BusinessVenture;