import React from "react";

import FundDetails from "./components/Common/FundDetails";
import Disclosures from "./components/Common/Disclosures";
import RiskFactors from "./components/Common/RiskFactors";
import Consent from "./components/Common/Consent";
import DocumentsCommon from "./components/Common/DocumentsCommon";

import StartupForm from "./components/Startup/StartupForm";
import BusinessForm from "./components/Business/BusinessForm";
import PropertyForm from "./components/Property/PropertyForm";

import StartupDocuments from "./components/Startup/StartupDocuments";
import BusinessDocuments from "./components/Business/BusinessDocuments";
import PropertyDocuments from "./components/Property/PropertyDocuments";

const StepContent = ({
  currentStep,
  formData,
  updateFormData,
  addToArray,
  removeFromArray,
  files,
  fileErrors,
  handleFileChange,
}) => {
  switch (currentStep) {
    case 1:
      return (
        <div className="fun-ff-step-content">
          <FundDetails formData={formData} updateFormData={updateFormData} />

          {formData.type === "startup" && (
            <StartupForm
              formData={formData}
              updateFormData={updateFormData}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
            />
          )}

          {formData.type === "business" && (
            <BusinessForm
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {formData.type === "property" && (
            <PropertyForm
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>
      );

    case 2:
      return (
        <div className="fun-ff-step-content">
          <Disclosures
            formData={formData}
            updateFormData={updateFormData}
          />

          <RiskFactors
            formData={formData}
            updateFormData={updateFormData}
            addToArray={addToArray}
            removeFromArray={removeFromArray}
          />
        </div>
      );

    case 3:
      return (
        <div className="fun-ff-step-content">
          <DocumentsCommon
            formData={formData}
            files={files}
            errors={fileErrors}
            handleFileChange={handleFileChange}
          />

          {formData.type === "startup" && (
            <StartupDocuments
              files={files}
              errors={fileErrors}
              handleFileChange={handleFileChange}
            />
          )}

          {formData.type === "business" && (
            <BusinessDocuments
              files={files}
              errors={fileErrors}
              handleFileChange={handleFileChange}
            />
          )}

          {formData.type === "property" && (
            <PropertyDocuments
              files={files}
              errors={fileErrors}
              handleFileChange={handleFileChange}
            />
          )}

          <Consent
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>
      );

    default:
      return null;
  }
};

export default StepContent;