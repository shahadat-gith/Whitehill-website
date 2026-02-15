import "./Steps.css"

const Step1RequestSummary = ({ amountRequested, setAmountRequested, fundingType, setFundingType }) => {
    return (
        <section className="sfr-section">
            <div className="sfr-section-body">
                <div className="sfr-form-group">
                    <label>
                        Amount<span>*</span>
                    </label>
                    <input
                        type="number"
                        className="sfr-input"
                        value={amountRequested}
                        onChange={(e) => setAmountRequested(e.target.value)}
                        placeholder="Enter amount (e.g., 5000000 for ₹50L)"
                        required
                    />
                    <small className="sfr-help-text">Specify the total funding amount you're seeking</small>
                </div>
                
                <div className="sfr-form-group">
                    <label>
                        Funding Type <span>*</span>
                    </label>
                    <select
                        className="sfr-select"
                        value={fundingType}
                        onChange={(e) => setFundingType(e.target.value)}
                        required
                    >
                        <option value="equity">Equity</option>
                        <option value="profitSharing">Profit Sharing</option>
                        <option value="revenueSharing">Revenue Sharing</option>
                    </select>
                    <small className="sfr-help-text">Choose your preferred investment structure</small>
                </div>
            </div>
        </section>
    );
};

export default Step1RequestSummary;
