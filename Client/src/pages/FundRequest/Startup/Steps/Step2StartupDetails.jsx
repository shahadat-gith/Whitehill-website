import "./Steps.css"

const Step2StartupDetails = ({ details, handleDetailChange }) => {
    return (
        <section className="sfr-section">
            <div className="sfr-section-content">
                <div className="sfr-grid sfr-grid-2">
                    <div className="sfr-field">
                        <label>Startup Name *</label>
                        <input
                            type="text"
                            value={details.name}
                            onChange={(e) => handleDetailChange("name", e.target.value)}
                            placeholder="e.g., TechVenture Solutions"
                            required
                        />
                    </div>
                    <div className="sfr-field">
                        <label>Sector *</label>
                        <input
                            type="text"
                            value={details.sector}
                            onChange={(e) => handleDetailChange("sector", e.target.value)}
                            placeholder="e.g., FinTech, EdTech, HealthTech, AgriTech"
                            required
                        />
                    </div>
                </div>

                <div className="sfr-field">
                    <label>Startup Description *</label>
                    <textarea
                        rows="4"
                        value={details.description}
                        onChange={(e) => handleDetailChange("description", e.target.value)}
                        placeholder="Provide a comprehensive overview of your startup. Include what your company does, the industry you operate in, your unique value proposition, and what sets you apart from competitors. (Min 100 words recommended)"
                        required
                    ></textarea>
                </div>

                <div className="sfr-grid sfr-grid-3">
                    <div className="sfr-field">
                        <label>Current Stage *</label>
                        <select
                            value={details.stage}
                            onChange={(e) => handleDetailChange("stage", e.target.value)}
                        >
                            <option value="idea">Idea Stage</option>
                            <option value="mvp">MVP Developed</option>
                            <option value="growth">Growth Stage</option>
                            <option value="scale">Scaling</option>
                        </select>
                    </div>
                    <div className="sfr-field">
                        <label>Team Size *</label>
                        <input
                            type="number"
                            value={details.teamSize}
                            onChange={(e) => handleDetailChange("teamSize", e.target.value)}
                            placeholder="e.g., 8"
                            required
                        />
                    </div>
                    <div className="sfr-field">
                        <label>Foundation Year *</label>
                        <input
                            type="number"
                            value={details.foundationYear}
                            onChange={(e) => handleDetailChange("foundationYear", e.target.value)}
                            placeholder="2023"
                            min="1900"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                </div>

                <div className="sfr-grid sfr-grid-2">
                    <div className="sfr-field">
                        <label>Current Annual Revenue</label>
                        <input
                            type="number"
                            value={details.currentRevenue}
                            onChange={(e) => handleDetailChange("currentRevenue", e.target.value)}
                            placeholder="₹ 15,00,000 (Leave blank if pre-revenue)"
                        />
                    </div>
                    <div className="sfr-field">
                        <label>Website URL</label>
                        <input
                            type="url"
                            value={details.website}
                            onChange={(e) => handleDetailChange("website", e.target.value)}
                            placeholder="https://www.yourcompany.com"
                        />
                    </div>
                </div>

                <div className="sfr-divider"></div>

                <div className="sfr-grid sfr-grid-2">
                    <div className="sfr-field">
                        <label>Fund Usage Breakdown *</label>
                        <textarea
                            rows="10"
                            value={details.fundUsageBreakdown}
                            onChange={(e) => handleDetailChange("fundUsageBreakdown", e.target.value)}
                            placeholder={`Provide a detailed breakdown of how you plan to allocate the requested funds. Example:
- Product Development - 40% (₹20L) - Hiring 2 developers, UI/UX improvements
- Marketing & Sales - 30% (₹15L) - Digital marketing campaigns, sales team expansion
- Operations - 20% (₹10L) - Office setup, infrastructure, licenses
- Working Capital - 10% (₹5L) - Day-to-day expenses for 6 months`}
                            required
                        ></textarea>
                    </div>
                    <div className="sfr-field">
                        <label>Key Risks & Mitigation Strategies *</label>
                        <textarea
                            rows="10"
                            value={details.keyRisks}
                            onChange={(e) => handleDetailChange("keyRisks", e.target.value)}
                            placeholder={`Identify potential risks and how you plan to address them. Example:
- Market Risk - Competition from established players
  Mitigation: Focus on niche segment, superior customer service
- Technology Risk - Dependency on third-party APIs
  Mitigation: Building backup systems, diversifying vendors
- Financial Risk - Extended customer payment cycles
  Mitigation: Maintaining 6-month runway, flexible pricing`}
                            required
                        ></textarea>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step2StartupDetails;
