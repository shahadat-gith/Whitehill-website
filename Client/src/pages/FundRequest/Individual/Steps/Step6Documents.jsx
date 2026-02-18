import React from "react";
import "./Steps.css";

const Step6Documents = ({ documents, setDocuments }) => {
    return (
        <section className="ifr-section">
            <div className="ifr-section-content">
                <div className="ifr-grid ifr-grid-2">
                    <div className="ifr-field">
                        <label>Land Ownership Proof *</label>
                        <div className="ifr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        landOwnershipProof: event.target.files[0],
                                    }))
                                }
                                required
                                id="landOwnershipProof"
                            />
                            <label htmlFor="landOwnershipProof" className="ifr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.landOwnershipProof
                                        ? documents.landOwnershipProof.name
                                        : "Upload land ownership documents (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Title deed, sale agreement, khata certificate</small>
                    </div>

                    <div className="ifr-field">
                        <label>Layout Plan *</label>
                        <div className="ifr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        layout: event.target.files[0],
                                    }))
                                }
                                required
                                id="layout"
                            />
                            <label htmlFor="layout" className="ifr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.layout
                                        ? documents.layout.name
                                        : "Upload approved layout plan (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Sanctioned plan from local authorities</small>
                    </div>

                    <div className="ifr-field">
                        <label>RERA Certificate *</label>
                        <div className="ifr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        reraCertificate: event.target.files[0],
                                    }))
                                }
                                required
                                id="reraCertificate"
                            />
                            <label htmlFor="reraCertificate" className="ifr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.reraCertificate
                                        ? documents.reraCertificate.name
                                        : "Upload RERA registration certificate (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>RERA approval certificate for the project</small>
                    </div>

                    <div className="ifr-field">
                        <label>Financial Model *</label>
                        <div className="ifr-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(event) =>
                                    setDocuments((prev) => ({
                                        ...prev,
                                        financialModel: event.target.files[0],
                                    }))
                                }
                                required
                                id="financialModel"
                            />
                            <label htmlFor="financialModel" className="ifr-file-label">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>
                                    {documents.financialModel
                                        ? documents.financialModel.name
                                        : "Upload financial projections & ROI (PDF)"}
                                </span>
                            </label>
                        </div>
                        <small>Project financials, revenue projections, ROI analysis</small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Step6Documents;
