import "./Steps.css"

const Step5Documents = ({ documents, setDocuments }) => {
    return (
        <section className="sfr-section">
            <div className="sfr-section-content">
                <div className="sfr-grid sfr-grid-2">
                    <div className="sfr-field">
                        <label>Financial Projections *</label>
                        <div className="sfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        projectionStatements: e.target.files[0],
                                    }))
                                }
                                required
                                id="projectionStatements"
                            />
                            <label htmlFor="projectionStatements" className="sfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.projectionStatements
                                        ? documents.projectionStatements.name
                                        : "Upload 3-5 year financial projections (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>P&L, cash flow, and revenue projections</small>
                    </div>

                    <div className="sfr-field">
                        <label>Legal Documents *</label>
                        <div className="sfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        legalDocuments: e.target.files[0],
                                    }))
                                }
                                required
                                id="legalDocuments"
                            />
                            <label htmlFor="legalDocuments" className="sfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.legalDocuments
                                        ? documents.legalDocuments.name
                                        : "Upload incorporation & legal docs (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Company registration, founder agreements, IP docs</small>
                    </div>

                    <div className="sfr-field">
                        <label>Pitch Deck *</label>
                        <div className="sfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        pitchDeck: e.target.files[0],
                                    }))
                                }
                                required
                                id="pitchDeck"
                            />
                            <label htmlFor="pitchDeck" className="sfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.pitchDeck
                                        ? documents.pitchDeck.name
                                        : "Upload investor pitch deck (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>10-15 slides covering problem, solution, market, team</small>
                    </div>

                    <div className="sfr-field">
                        <label>Shareholding Pattern *</label>
                        <div className="sfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        shareHoldingPattern: e.target.files[0],
                                    }))
                                }
                                required
                                id="shareHoldingPattern"
                            />
                            <label htmlFor="shareHoldingPattern" className="sfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.shareHoldingPattern
                                        ? documents.shareHoldingPattern.name
                                        : "Upload cap table/shareholding details (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Current equity distribution among stakeholders</small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step5Documents;
