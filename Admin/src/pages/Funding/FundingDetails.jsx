import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./FundingDetails.css";
import { formatDate } from "../../utils/utility";

import Startup from "./components/Startup";
import Business from "./components/Business";
import Property from "./components/Property";
import Consents from "./components/Consents";
import Disclosures from "./components/Disclosures";
import RiskFactors from "./components/RiskFactors";
import Document from "./components/Document";
import FundingBasic from "./components/FundingBasic";
import ApplicantDetails from "./components/ApplicantDetails";
import PaymentModal from "./PaymentModal";

const FundingDetails = () => {
  const { fundingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get(`/api/admin/funding/${fundingId}`);
      if (res.success) setData(res.data);
      else toast.error(res.message || "Failed to load funding details");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [fundingId]);

  useEffect(() => {
    if (fundingId) fetchDetails();
  }, [fundingId, fetchDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "success";
      case "rejected": return "danger";
      case "under_review": return "warning";
      default: return "default";
    }
  };

  const allDocuments = useMemo(() => {
    if (!data?.documents) return [];
    return Object.entries(data.documents)
      .filter(([, value]) => value != null)
      .map(([key, value]) => ({
        name: key,
        label: formatDocumentName(key),
        value,
      }));
  }, [data]);

  if (loading) return (
    <div className="fde-loading">
      <i className="fa-solid fa-spinner fa-spin"></i>
      <span>Loading funding details...</span>
    </div>
  );

  if (!data) return null;

  const { user = {}, fundDetails = {}, verification = {} } = data;

  return (
    <div className="fde-container">

      {/* HEADER */}
      <div className="fde-header">
        <div className="fde-header-actions">
          <span className={`fde-status fde-status-${getStatusColor(data.status)}`}>
            {data.status?.replace("_", " ").toUpperCase()}
          </span>

          <button
            className="btn btn-primary"
            onClick={() => navigate(`/funding/approve/${fundingId}`)}
          >
            <i className="fa-solid fa-check-circle"></i>
            <span>Approve</span>
          </button>

          {data.status === "approved" && (
            <button
              className="btn btn-success"
              onClick={() => setShowPaymentModal(true)}
            >
              <i className="fa-solid fa-money-bill"></i>
              <span>Initiate Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="fde-grid">

        {/* LEFT */}
        <div className="fde-col-left">
          <ApplicantDetails user={user} />
          <FundingBasic fundDetails={fundDetails} />
          <Startup funding={data} />
          <Business funding={data} />
          <Property funding={data} />
          <Consents funding={data} />
          <Disclosures funding={data} />
          <RiskFactors funding={data} />
        </div>

        {/* RIGHT */}
        <div className="fde-col-right">

          {allDocuments.length > 0 && (
            <div className="fde-card">
              <div className="fde-card-title">
                <i className="fa-solid fa-file-pdf"></i>
                <h3>Documents ({allDocuments.length})</h3>
              </div>

              <div className="fde-documents-list">
                {allDocuments.map((doc) => (
                  <Document key={doc.name} doc={doc} />
                ))}
              </div>
            </div>
          )}

          {data.verification?.extraRequests?.some(req => req.status === "submitted" && req.files?.length > 0) && (
            <div className="fde-card">
              <div className="fde-card-title">
                <i className="fa-solid fa-file-upload"></i>
                <h3>Additional Documents</h3>
              </div>

              <div className="fde-extra-documents-list">
                {data.verification.extraRequests
                  .filter(req => req.status === "submitted" && req.files?.length > 0)
                  .map((req, reqIndex) => (
                    <div key={req._id || reqIndex} className="fde-extra-request-group">
                      <div className="fde-extra-request-header">
                        <span className="fde-extra-request-message">{req.message}</span>
                        <span className="fde-extra-request-date">
                          Submitted {formatDate(req.submittedAt || req.requestedAt)}
                        </span>
                      </div>
                      <div className="fde-extra-files-list">
                        {req.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="fde-extra-file-item">
                            <i className="fa-solid fa-file"></i>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fde-extra-file-link"
                            >
                              {file.originalName || `Document ${fileIndex + 1}`}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="fde-card">
            <div className="fde-card-title">
              <i className="fa-solid fa-clock"></i>
              <h3>Timeline</h3>
            </div>

            <div className="fde-timeline">

              <div className="fde-timeline-item">
                <div className="fde-timeline-dot"></div>
                <div className="fde-timeline-content">
                  <div className="fde-timeline-title">Request Submitted</div>
                  <div className="fde-timeline-date">
                    {formatDate(data.createdAt)}
                  </div>
                </div>
              </div>

              {verification.reviewedAt && (
                <div className="fde-timeline-item">
                  <div className="fde-timeline-dot"></div>
                  <div className="fde-timeline-content">
                    <div className="fde-timeline-title">
                      {data.status === "approved" ? "Approved" : "Reviewed"}
                    </div>
                    <div className="fde-timeline-date">
                      {formatDate(verification.reviewedAt)}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <PaymentModal
          fundingId={fundingId}
          approvedAmount={verification.approvedAmount}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchDetails();
          }}
        />
      )}
    </div>
  );
};

export default FundingDetails;

function formatDocumentName(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}