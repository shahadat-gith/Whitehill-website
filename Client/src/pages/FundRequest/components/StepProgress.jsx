import React from "react";
import "./StepProgress.css";

const StepProgress = ({ currentStep, totalSteps, stepTitles }) => {
    const color = "#50c878";
    
    // When on submit page (currentStep > totalSteps), show all steps as completed
    const isSubmitPage = currentStep > totalSteps;
    const completedSteps = isSubmitPage ? totalSteps : currentStep - 1;
    const progressPercentage = isSubmitPage ? 100 : (completedSteps / totalSteps) * 100;

    // Generate gradient background
    const getProgressBarStyle = () => {
        return {
            width: `${progressPercentage}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 60%, ${color}99 100%)`
        };
    };

    return (
        <div className="step-progress-container">
            <div className="progress-header">
                <div className="progress-meta">
                    <span className="progress-eyebrow" style={{ color }}>
                        Progress
                    </span>
                    <h3 className="progress-title">
                        {isSubmitPage ? "Review & Submit" : stepTitles[currentStep - 1]}
                    </h3>
                </div>
                <span className="progress-badge">
                    {completedSteps}
                    <span className="progress-badge-sep">/</span>
                    {totalSteps}
                </span>
            </div>

            <div className="progress-bar-wrapper">
                <div className="progress-bar-track">
                    <div
                        className="progress-bar-fill"
                        style={getProgressBarStyle()}
                    >
                        {progressPercentage > 0 && (
                            <span className="progress-percentage">
                                {Math.round(progressPercentage)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="progress-steps">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`step-dot ${isSubmitPage || i < completedSteps
                                ? "step-done"
                                : i === completedSteps
                                    ? "step-active"
                                    : "step-pending"
                            }`}
                        style={
                            (isSubmitPage || i < completedSteps)
                                ? { background: color, borderColor: color }
                                : i === completedSteps
                                ? { borderColor: color, color: color }
                                : {}
                        }
                    >
                        {isSubmitPage || i < completedSteps ? (
                            <svg viewBox="0 0 10 8" fill="none">
                                <path
                                    d="M1 4l2.5 2.5L9 1"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <span>{i + 1}</span>

                        )}
                    </div>
                ))}
               
            </div>
             <div className="completed-msg">
                    <p>{completedSteps === 1 ? `${completedSteps} step completed` : `${completedSteps} steps completed!`} </p>
                </div>
        </div>
    );
};

export default StepProgress;