import React from "react";
import { useNavigate } from "react-router-dom";
import "./Congratulations.css";

const Congratulations = () => {
    const navigate = useNavigate();

    const handleOkayClick = () => {
        // Clear all routing history by navigating to home and replacing the entire history stack
        navigate("/", { replace: true });
        // Additional cleanup to ensure no back navigation
        window.history.pushState(null, "", "/");
    };

    return (
        <div className="congratulations-page">
            <div className="congratulations-container">
                <div className="congratulations-content">
                    <div className="success-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    
                    <h1 className="congratulations-title">Congratulations!</h1>
                    
                    <p className="congratulations-message">
                        Your fund request has been submitted successfully.
                    </p>
                    
                    <p className="tracking-message">
                        For tracking your request, visit your profile page.
                    </p>
                    
                    <button 
                        className="okay-button" 
                        onClick={handleOkayClick}
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Congratulations;
