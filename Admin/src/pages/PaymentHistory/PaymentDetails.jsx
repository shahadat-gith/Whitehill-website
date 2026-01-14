import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PaymentDetails.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import { formatAmount, formatDate } from "../../utils/utility";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);

  const fetchDetails = useCallback(async () => {
    if (!paymentId) return;

    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/payment-gateway/details", {
        params: { paymentId },
      });

      if (data.success) {
        setPayment(data.payment);
      } else {
        toast.error(data.message || "Failed to load payment details");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load payment details");
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const view = useMemo(() => {
    if (!payment) return null;

    const amountINR = payment.amount != null ? payment.amount / 100 : null; // paise -> INR
    const createdMs = payment.created_at ? payment.created_at * 1000 : null;

    const status = String(payment.status || "unknown").toLowerCase();
    const tone =
      status === "captured"
        ? "ok"
        : status === "failed"
        ? "danger"
        : status === "refunded"
        ? "info"
        : "warn";

    return {
      amountINR,
      createdMs,
      status,
      tone,
    };
  }, [payment]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  if (loading) {
    return (
      <div className="pdt-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <span>Loading payment details...</span>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="pdt-empty">
        <div className="pdt-empty-card">
          <i className="fa-solid fa-circle-info"></i>
          <h4>No payment loaded</h4>
          <p>Open this page with a valid payment id.</p>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const { amountINR, createdMs, status, tone } = view || {};

  return (
    <div className="pdt-container">
      {/* Header */}
      <div className="pdt-header">
        <div>
          <h2>Payment Details</h2>
          <p className="pdt-subtitle">
            Payment ID: <span className="pdt-mono">{paymentId}</span>
          </p>
        </div>

        <div className="pdt-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back</span>
          </button>

          <button className="btn btn-primary" onClick={fetchDetails} disabled={loading}>
            <i className="fa-solid fa-rotate"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`pdt-banner ${tone}`}>
        <div className="pdt-banner-left">
          <div className="pdt-banner-icon">
            <i
              className={`fa-solid ${
                tone === "ok"
                  ? "fa-circle-check"
                  : tone === "danger"
                  ? "fa-circle-xmark"
                  : tone === "info"
                  ? "fa-circle-info"
                  : "fa-hourglass-half"
              }`}
            ></i>
          </div>

          <div className="pdt-banner-text">
            <div className="pdt-banner-title">
              Status: <span className={`pdt-pill ${status}`}>{payment.status || "unknown"}</span>
            </div>
            <div className="pdt-banner-sub">
              {payment.captured ? "Captured by gateway" : "Not captured"}
              {payment.method ? ` • Method: ${String(payment.method).toUpperCase()}` : ""}
            </div>
          </div>
        </div>

        <button className="btn btn-secondary pdt-copy-btn" onClick={() => copy(payment.id)}>
          <i className="fa-solid fa-copy"></i>
          <span>Copy ID</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="pdt-grid">
        {/* Overview */}
        <div className="pdt-card">
          <div className="pdt-card-title">
            <i className="fa-solid fa-receipt"></i>
            <span>Overview</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Amount</span>
            <span className="pdt-v pdt-strong">{amountINR != null ? formatAmount(amountINR) : "-"}</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Created</span>
            <span className="pdt-v">{createdMs ? formatDate(createdMs) : "-"}</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Captured</span>
            <span className={`pdt-v ${payment.captured ? "pdt-ok" : "pdt-bad"}`}>
              <i className={`fa-solid ${payment.captured ? "fa-check" : "fa-xmark"}`}></i>
              <span style={{ marginLeft: 8 }}>{payment.captured ? "Yes" : "No"}</span>
            </span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Currency</span>
            <span className="pdt-v">{payment.currency || "-"}</span>
          </div>
        </div>

        {/* Customer */}
        <div className="pdt-card">
          <div className="pdt-card-title">
            <i className="fa-solid fa-user"></i>
            <span>Customer</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Email</span>
            <span className="pdt-v">{payment.email || "-"}</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Contact</span>
            <span className="pdt-v">{payment.contact || "-"}</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Description</span>
            <span className="pdt-v">{payment.description || "-"}</span>
          </div>
        </div>

        {/* Gateway IDs */}
        <div className="pdt-card">
          <div className="pdt-card-title">
            <i className="fa-solid fa-link"></i>
            <span>Gateway IDs</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Payment ID</span>
            <span className="pdt-v pdt-mono">
              {payment.id}
              <button className="pdt-mini-copy" onClick={() => copy(payment.id)} type="button">
                <i className="fa-solid fa-copy"></i>
              </button>
            </span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Order ID</span>
            <span className="pdt-v pdt-mono">
              {payment.order_id || "-"}
              {payment.order_id ? (
                <button className="pdt-mini-copy" onClick={() => copy(payment.order_id)} type="button">
                  <i className="fa-solid fa-copy"></i>
                </button>
              ) : null}
            </span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Invoice ID</span>
            <span className="pdt-v pdt-mono">{payment.invoice_id || "-"}</span>
          </div>
        </div>

        {/* Method Info */}
        <div className="pdt-card">
          <div className="pdt-card-title">
            <i className="fa-solid fa-credit-card"></i>
            <span>Method</span>
          </div>

          <div className="pdt-row">
            <span className="pdt-k">Method</span>
            <span className="pdt-v">{payment.method ? String(payment.method).toUpperCase() : "-"}</span>
          </div>

          {payment.bank ? (
            <div className="pdt-row">
              <span className="pdt-k">Bank</span>
              <span className="pdt-v">{payment.bank}</span>
            </div>
          ) : null}

          {payment.wallet ? (
            <div className="pdt-row">
              <span className="pdt-k">Wallet</span>
              <span className="pdt-v">{payment.wallet}</span>
            </div>
          ) : null}

          {payment.vpa ? (
            <div className="pdt-row">
              <span className="pdt-k">VPA</span>
              <span className="pdt-v pdt-mono">{payment.vpa}</span>
            </div>
          ) : null}
        </div>

        {/* Failure Box */}
        {(payment.error_code || payment.error_description) && (
          <div className="pdt-card pdt-span-2 pdt-error">
            <div className="pdt-card-title">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Failure Details</span>
            </div>

            <div className="pdt-row">
              <span className="pdt-k">Error Code</span>
              <span className="pdt-v pdt-bad">{payment.error_code || "-"}</span>
            </div>

            <div className="pdt-row">
              <span className="pdt-k">Description</span>
              <span className="pdt-v pdt-bad">{payment.error_description || "-"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
