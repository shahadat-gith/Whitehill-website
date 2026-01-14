import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./InvestmentDetails.css";
import { formatAmount, formatDate } from "../../utils/utility";
import StatusUpdateModal from "./StatusUpdateModal";
import InvestmentStatusBanner from "./InvestmentStatusBanner";

const InvestmentDetails = () => {
  const { investmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/admin/investment/details", { investmentId });

      if (res.data?.success) setData(res.data);
      else toast.error(res.data?.message || "Failed to load investment details");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [investmentId]);

  useEffect(() => {
    if (investmentId) fetchDetails();
  }, [investmentId, fetchDetails]);

  const view = useMemo(() => {
    const investment = data?.investment || null;
    const user = investment?.user || {};
    const project = investment?.project || {};
    const tx = investment?.transaction || {};
    const rzp = data?.razorpayPayment || null;
    const rzpErr = data?.razorpayError || null;

    return { investment, user, project, tx, rzp, rzpErr };
  }, [data]);

  if (loading) {
    return (
      <div className="id-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <span>Loading investment details...</span>
      </div>
    );
  }

  if (!view.investment) return null;

  const { investment, user, project, tx, rzp, rzpErr } = view;

  return (
    <div className="id-container">
      {/* Header Section */}
      <div className="id-header">
        <div>
          <h2>Investment Details</h2>
          <p className="id-subtitle">
            Investment ID: <span className="id-mono">{investmentId}</span>
          </p>
        </div>

        <div className="id-header-actions">
          {project?._id && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <i className="fa-solid fa-building"></i>
              <span>View Project</span>
            </button>
          )}

          <button className="btn btn-primary" onClick={fetchDetails} disabled={loading}>
            <i className="fa-solid fa-rotate"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ✅ Investment Status (Component) */}
      <InvestmentStatusBanner
        investment={investment}
        onUpdate={() => setShowStatusModal(true)}
      />

      {/* Main Content Grid */}
      <div className="id-grid">
        {/* Investor Information */}
        <div className="id-card">
          <div className="id-card-title">
            <i className="fa-solid fa-user"></i>
            <span>Investor Information</span>
          </div>

          <div className="id-user">
            <img
              className="id-avatar"
              src={user?.image?.url || "/user.png"}
              alt={user.fullName || "User"}
            />
            <div>
              <div className="id-user-name">{user.fullName || "N/A"}</div>
              <div className="id-muted">{user.email || "N/A"}</div>
              <div className="id-muted">{user.phone || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="id-card">
          <div className="id-card-title">
            <i className="fa-solid fa-building"></i>
            <span>Project Details</span>
          </div>

          <div className="id-row">
            <span className="id-label">Project Name</span>
            <span className="id-value">{project.name || "N/A"}</span>
          </div>

          <div className="id-row">
            <span className="id-label">Category</span>
            <span className="id-value">{project.category || "N/A"}</span>
          </div>

          <div className="id-row">
            <span className="id-label">Location</span>
            <span className="id-value">
              {project.city && project.state
                ? `${project.city}, ${project.state}`
                : project.city || project.state || "N/A"}
            </span>
          </div>

          <div className="id-row">
            <span className="id-label">Risk Level</span>
            <span className={`id-badge ${project.risk?.toLowerCase() || ""}`}>
              {project.risk || "N/A"}
            </span>
          </div>

          <div className="id-row">
            <span className="id-label">Target Return</span>
            <span className="id-value">{project.targetReturn || "N/A"}</span>
          </div>
        </div>

        {/* Investment Transaction */}
        <div className="id-card">
          <div className="id-card-title">
            <i className="fa-solid fa-receipt"></i>
            <span>Investment Transaction</span>
          </div>

          <div className="id-row">
            <span className="id-label">Investment Amount</span>
            <span className="id-value id-strong">{formatAmount(tx.amount)}</span>
          </div>

          <div className="id-row">
            <span className="id-label">Investment Date</span>
            <span className="id-value">{formatDate(tx.date)}</span>
          </div>

          <div className="id-row">
            <span className="id-label">Payment ID</span>
            <span className="id-value id-mono">{tx.razorpay_payment_id || "N/A"}</span>
          </div>

          <div className="id-row">
            <span className="id-label">Order ID</span>
            <span className="id-value id-mono">{tx.razorpay_order_id || "N/A"}</span>
          </div>
        </div>

        {/* Payment Gateway Details */}
        <div className="id-card id-span-3">
          <div className="id-card-title">
            <i className="fa-solid fa-credit-card"></i>
            <span>Payment Gateway Details</span>
          </div>

          {!rzp ? (
            <div className="id-empty-state">
              <i className="fa-solid fa-circle-info"></i>
              <p>
                {rzpErr?.message
                  ? `Unable to fetch payment details: ${rzpErr.message}`
                  : "Payment gateway information is not available for this transaction."}
              </p>
            </div>
          ) : (
            <div className="id-rzp-grid">
              <div className="id-row">
                <span className="id-label">Payment ID</span>
                <span className="id-value id-mono">{rzp.id || "N/A"}</span>
              </div>

              <div className="id-row">
                <span className="id-label">Payment Status</span>
                <span className={`id-pill ${rzp.status || ""}`}>
                  {rzp.status || "Unknown"}
                </span>
              </div>

              <div className="id-row">
                <span className="id-label">Captured</span>
                <span className="id-value">
                  {rzp.captured ? (
                    <span className="id-success">
                      <i className="fa-solid fa-check"></i> Yes
                    </span>
                  ) : (
                    <span className="id-danger">
                      <i className="fa-solid fa-times"></i> No
                    </span>
                  )}
                </span>
              </div>

              <div className="id-row">
                <span className="id-label">Amount</span>
                <span className="id-value id-strong">
                  {rzp.amount != null ? formatAmount(rzp.amount / 100) : "N/A"}
                </span>
              </div>

              <div className="id-row">
                <span className="id-label">Payment Method</span>
                <span className="id-value">{rzp.method?.toUpperCase() || "N/A"}</span>
              </div>

              <div className="id-row">
                <span className="id-label">Email</span>
                <span className="id-value">{rzp.email || "N/A"}</span>
              </div>

              <div className="id-row">
                <span className="id-label">Contact</span>
                <span className="id-value">{rzp.contact || "N/A"}</span>
              </div>

              <div className="id-row">
                <span className="id-label">Transaction Date</span>
                <span className="id-value">
                  {rzp.created_at ? formatDate(rzp.created_at * 1000) : "N/A"}
                </span>
              </div>

              {(rzp.error_code || rzp.error_description) && (
                <>
                  <div className="id-row">
                    <span className="id-label">Error Code</span>
                    <span className="id-value id-danger">{rzp.error_code || "N/A"}</span>
                  </div>

                  <div className="id-row id-row-full">
                    <span className="id-label">Failure Reason</span>
                    <span className="id-value id-danger">
                      {rzp.error_description || "N/A"}
                    </span>
                  </div>
                </>
              )}

              {rzp.order_id && (
                <div className="id-row">
                  <span className="id-label">Order ID</span>
                  <span className="id-value id-mono">{rzp.order_id}</span>
                </div>
              )}

              {rzp.bank && (
                <div className="id-row">
                  <span className="id-label">Bank</span>
                  <span className="id-value">{rzp.bank}</span>
                </div>
              )}

              {rzp.wallet && (
                <div className="id-row">
                  <span className="id-label">Wallet</span>
                  <span className="id-value">{rzp.wallet}</span>
                </div>
              )}

              {rzp.card_id && (
                <div className="id-row">
                  <span className="id-label">Card ID</span>
                  <span className="id-value id-mono">{rzp.card_id}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={(refresh) => {
          setShowStatusModal(false);
          if (refresh) fetchDetails();
        }}
        investmentId={investmentId}
        email={user?.email}
        currentStatus={investment?.status}
      />
    </div>
  );
};

export default InvestmentDetails;
