import React from "react";
import "./StepProgress.css";

const StepProgress = ({ currentStep, totalSteps, stepTitles }) => {
  // Logic for progress calculation
  const isSubmitPage = currentStep > totalSteps;
  const completedSteps = isSubmitPage ? totalSteps : currentStep - 1;
  const progressPercentage = isSubmitPage ? 100 : (completedSteps / (totalSteps - 1)) * 100;

  return (
    <div className="step-progress-container">
      {/* HEADER SECTION */}
      <div className="progress-header">
        <div className="progress-meta">
          <h3 className="progress-title">
            {isSubmitPage ? "Final Review & Submission" : stepTitles[currentStep - 1]}
          </h3>
        </div>
        <div className="progress-badge-wrapper">
          <span className="progress-badge">
            Step {isSubmitPage ? totalSteps : currentStep} 
            <span className="progress-badge-sep">of</span> 
            {totalSteps}
          </span>
        </div>
      </div>

      {/* VISUAL TRACK & DOTS */}
      <div className="progress-visual-area">
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="progress-shimmer"></div>
          </div>
        </div>

        <div className="progress-steps-row">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isDone = isSubmitPage || i < completedSteps;
            const isActive = i === completedSteps && !isSubmitPage;
            
            return (
              <div key={i} className="step-node-wrapper">
                <div 
                  className={`step-dot ${isDone ? "step-done" : isActive ? "step-active" : "step-pending"}`}
                >
                  {isDone ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className={`step-label ${isActive ? "active" : ""}`}>
                   {stepTitles[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;