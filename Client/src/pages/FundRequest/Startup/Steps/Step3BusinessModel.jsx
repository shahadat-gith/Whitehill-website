import "./Steps.css"

const Step3BusinessModel = ({ businessModel, handleBusinessModelChange }) => {
    return (
        <section className="sfr-section">
            <div className="sfr-section-content">
                <div className="sfr-grid sfr-grid-2">
                    <div className="sfr-field">
                        <label>Problem Statement *</label>
                        <textarea
                            rows="8"
                            value={businessModel.problemDescription}
                            onChange={(e) => handleBusinessModelChange("problemDescription", e.target.value)}
                            placeholder={`Describe the specific problem or pain point you're addressing. Be clear about:
- Who faces this problem?
- How significant is the problem?
- What are the current consequences of this problem?
- Why hasn't it been solved effectively before?

Example: Small businesses struggle with inventory management, leading to 30% stockouts and ₹5L average annual losses per business due to lack of affordable, easy-to-use solutions.`}
                            required
                        ></textarea>
                    </div>
                    <div className="sfr-field">
                        <label>Your Solution *</label>
                        <textarea
                            rows="8"
                            value={businessModel.solutionDescription}
                            onChange={(e) => handleBusinessModelChange("solutionDescription", e.target.value)}
                            placeholder={`Explain how your product/service solves the problem. Include:
- Core features and functionality
- How it works (brief overview)
- Why it's better than existing solutions
- What makes it unique or innovative

Example: AI-powered cloud inventory system with real-time tracking, automated reordering, and predictive analytics - 10x cheaper than enterprise solutions, set up in 5 minutes.`}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="sfr-field">
                    <label>Product/Service Description *</label>
                    <textarea
                        rows="5"
                        value={businessModel.productDescription}
                        onChange={(e) => handleBusinessModelChange("productDescription", e.target.value)}
                        placeholder="Detailed description of your product or service offerings, key features, and current development status"
                        required
                    ></textarea>
                </div>

                <div className="sfr-grid sfr-grid-2">
                    <div className="sfr-field">
                        <label>Target Customer Profile *</label>
                        <textarea
                            rows="6"
                            value={businessModel.targetCustomer}
                            onChange={(e) => handleBusinessModelChange("targetCustomer", e.target.value)}
                            placeholder={`Define your ideal customer. Include:
- Demographics (age, location, income level)
- Company size (if B2B)
- Specific pain points they experience
- Where they currently look for solutions

Example: Indian SME retailers (₹50L-5Cr revenue), 20-500 SKUs, using Excel/paper, tier 2-3 cities, 2M+ addressable market`}
                            required
                        ></textarea>
                    </div>
                    <div className="sfr-field">
                        <label>Revenue Model *</label>
                        <textarea
                            rows="6"
                            value={businessModel.revenueModel}
                            onChange={(e) => handleBusinessModelChange("revenueModel", e.target.value)}
                            placeholder={`Explain how you make money. Include:
- Pricing structure (subscription, one-time, freemium)
- Average revenue per customer
- Payment terms and billing cycle
- Multiple revenue streams (if applicable)

Example: SaaS subscription - ₹999/month basic, ₹2999/month premium. LTV ₹36K, CAC ₹10K. Additional revenue from marketplace commissions.`}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="sfr-field">
                    <label>Current Traction *</label>
                    <select
                        value={businessModel.currentTraction}
                        onChange={(e) => handleBusinessModelChange("currentTraction", e.target.value)}
                    >
                        <option value="revenue">Generating Revenue</option>
                        <option value="users">Active Users</option>
                        <option value="pilots">Pilot Projects</option>
                        <option value="prelaunch">Pre-Launch</option>
                    </select>
                    <small>Select your current business traction level</small>
                </div>
            </div>
        </section>
    );
};

export default Step3BusinessModel;
