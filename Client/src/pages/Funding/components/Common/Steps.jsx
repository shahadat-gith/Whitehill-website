import React from "react";
import "./styles/Steps.css";

const Steps = ({ currentStep, totalSteps }) => {
  return (
    <div className="steps-container">
      <div className="steps-progress">
        <div className="steps-progress-bar">
          <div
            className="steps-progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="steps-counter">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default Steps;