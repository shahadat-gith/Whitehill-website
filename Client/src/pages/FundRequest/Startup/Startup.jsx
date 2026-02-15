import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../../Context/AppContext";
import StepProgress from "../components/StepProgress";
import LocationStep from "../components/LocationStep";
import Step1RequestSummary from "./Steps/Step1RequestSummary";
import Step2StartupDetails from "./Steps/Step2StartupDetails";
import Step3BusinessModel from "./Steps/Step3BusinessModel";
import Step4FoundingTeam from "./Steps/Step4FoundingTeam";
import Step5Documents from "./Steps/Step5Documents";
import "./Startup.css";

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

const Startup = () => {
    const { user } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const TOTAL_STEPS = 6;
    const STORAGE_KEY = "startupFundRequest";

    const stepTitles = [
        "Fund Details",
        "Startup Details",
        "Business Model",
        "Founding Team",
        "Documents",
        "Location"
    ];

    const currentStep = parseInt(searchParams.get("step") || "1");

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
        }
    }, []);

    // Save data to sessionStorage whenever it changes
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

    const goToStep = (step) => {
        if (step >= 1 && step <= TOTAL_STEPS) {
            const currentType = searchParams.get("type") || "startup";
            setSearchParams({ type: currentType, step: step.toString() });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep < TOTAL_STEPS) {
            goToStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
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
        goToStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            toast.success("Startup fund request submitted successfully!");
            resetForm();
            navigate("/profile?tab=fund-requests");
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
                        fundingType={details.fundingType}
                        setFundingType={(value) => handleDetailChange("fundingType", value)}
                    />
                );
            case 2:
                return (
                    <Step2StartupDetails
                        details={details}
                        handleDetailChange={handleDetailChange}
                    />
                );
            case 3:
                return (
                    <Step3BusinessModel
                        businessModel={details.businessModel}
                        handleBusinessModelChange={handleBusinessModelChange}
                    />
                );
            case 4:
                return (
                    <Step4FoundingTeam
                        foundingTeam={details.foundingTeam}
                        handleFoundingTeamChange={handleFoundingTeamChange}
                        addFoundingTeamMember={addFoundingTeamMember}
                        removeFoundingTeamMember={removeFoundingTeamMember}
                    />
                );
            case 5:
                return (
                    <Step5Documents
                        documents={documents}
                        setDocuments={setDocuments}
                    />
                );
            case 6:
                return (
                    <LocationStep
                        location={location}
                        handleLocationChange={handleLocationChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="sfr-container">
            <StepProgress 
                currentStep={currentStep} 
                totalSteps={TOTAL_STEPS}
                stepTitles={stepTitles}
            />

            <form className="sfr-form" onSubmit={currentStep === TOTAL_STEPS ? handleSubmit : handleNext}>
                {renderStep()}

                {/* Form Actions */}
                <div className="sfr-actions">
                    {currentStep > 1 && (
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handlePrevious}
                        >
                            <i className="fas fa-arrow-left"></i> Previous
                        </button>
                    )}
                    
                    {currentStep < TOTAL_STEPS ? (
                        <button type="submit" className="btn btn-primary">
                            Next <i className="fas fa-arrow-right"></i>
                        </button>
                    ) : (
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
                    )}
                </div>
            </form>
        </div>
    );
};

export default Startup;
