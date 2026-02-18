import React from "react";
import "./Steps.css";

const Step6Documents = ({ documents, setDocuments }) => {
    return (
        <section className="bfr-section">
            <div className="bfr-section-content">
                <div className="bfr-grid bfr-grid-2">
                    <div className="bfr-field">
                        <label>Business Plan *</label>
                        <div className="bfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        businessPlan: event.target.files[0],
                                    }))
                                }
                                required
                                id="businessPlan"
                            />
                            <label htmlFor="businessPlan" className="bfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.businessPlan
                                        ? documents.businessPlan.name
                                        : "Upload business plan document (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Detailed business plan with strategy and projections</small>
                    </div>

                    <div className="bfr-field">
                        <label>Bank Statements *</label>
                        <div className="bfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        bankStatements: event.target.files[0],
                                    }))
                                }
                                required
                                id="bankStatements"
                            />
                            <label htmlFor="bankStatements" className="bfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.bankStatements
                                        ? documents.bankStatements.name
                                        : "Upload last 6 months bank statements (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Recent bank statements for financial verification</small>
                    </div>

                    <div className="bfr-field">
                        <label>Financial Statements *</label>
                        <div className="bfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        financialStatements: event.target.files[0],
                                    }))
                                }
                                required
                                id="financialStatements"
                            />
                            <label htmlFor="financialStatements" className="bfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.financialStatements
                                        ? documents.financialStatements.name
                                        : "Upload financial statements (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Balance sheet, P&L, cash flow statements</small>
                    </div>

                    <div className="bfr-field">
                        <label>GST Returns *</label>
                        <div className="bfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        gstReturns: event.target.files[0],
                                    }))
                                }
                                required
                                id="gstReturns"
                            />
                            <label htmlFor="gstReturns" className="bfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.gstReturns
                                        ? documents.gstReturns.name
                                        : "Upload GST returns (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Last 12 months GST filing records</small>
                    </div>

                    <div className="bfr-field">
                        <label>Legal Documents *</label>
                        <div className="bfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        legalDocuments: event.target.files[0],
                                    }))
                                }
                                required
                                id="legalDocuments"
                            />
                            <label htmlFor="legalDocuments" className="bfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.legalDocuments
                                        ? documents.legalDocuments.name
                                        : "Upload legal documents (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Registration, licenses, compliance certificates</small>
                    </div>

                    <div className="bfr-field">
                        <label>Cash Flow Statement *</label>
                        <div className="bfr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        cashFlowStatement: event.target.files[0],
                                    }))
                                }
                                required
                                id="cashFlowStatement"
                            />
                            <label htmlFor="cashFlowStatement" className="bfr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.cashFlowStatement
                                        ? documents.cashFlowStatement.name
                                        : "Upload cash flow projections (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Historical and projected cash flow analysis</small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step6Documents;
