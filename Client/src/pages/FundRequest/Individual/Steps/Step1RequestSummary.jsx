import React from "react";
import "./Steps.css";

const Step1RequestSummary = ({ amountRequested, setAmountRequested }) => {
    return (
        <section className="ifr-section">
            <div className="ifr-section-content">
                <div className="ifr-grid ifr-grid-2">
                    <div className="ifr-field">
                        <label>Amount Requested *</label>
                        <input
                            type="number"
                            value={amountRequested}
                            onChange={(event) => setAmountRequested(event.target.value)}
                            placeholder="₹ 50,00,000"
                            required
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step1RequestSummary;
