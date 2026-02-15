import React from "react";
import "./StepProgress.css";

const StepProgress = ({ currentStep, totalSteps, stepTitles }) => {
    return (
        <div className="step-progress-container">
            <div className="step-progress">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            <div className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                <div className="step-circle">
                                    {isCompleted ? (
                                        <i className="fas fa-check"></i>
                                    ) : (
                                        <span>{stepNumber}</span>
                                    )}
                                </div>
                                <div className="step-label">{stepTitles[index]}</div>
                            </div>
                            {stepNumber < totalSteps && (
                                <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepProgress;
