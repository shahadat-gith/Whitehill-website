import React, { useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./PaymentModal.css";

const PaymentModal = ({ fundingId, approvedAmount, onClose, onSuccess }) => {
  const [method, setMethod] = useState("manual");
  const [loading, setLoading] = useState(false);

  const [manualData, setManualData] = useState({
    invoiceId: "",
    transactionId: "",
    payMethod: "Bank Transfer", // Renamed to payMethod to avoid conflict with top-level 'method'
  });

  const formatAmount = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ───────── MANUAL PAYMENT ─────────
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!manualData.invoiceId.trim() || !manualData.transactionId.trim()) {
      toast.error("All manual fields are required");
      return;
    }

    try {
      setLoading(true);

      const { data: res } = await api.post("/api/funding/payment/initiate", {
        fundingId,
        method: "manual",
        paymentData: {
          invoiceId: manualData.invoiceId,
          transactionId: manualData.transactionId,
          payMethod: manualData.payMethod, // Sent as payMethod to match backend update
        },
      });

      if (res.success) {
        toast.success("Manual payment recorded successfully");
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  // ───────── RAZORPAY PAYMENT ─────────
  const handleRazorpaySubmit = async (e) => {
    e.preventDefault();

    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Please check your connection.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Order on Backend
      const { data: res } = await api.post("/api/funding/payment/initiate", {
        fundingId,
        method: "razorpay",
      });

      if (!res.success) throw new Error(res.message);

      const { order_id, amount, currency } = res.data;

      // Step 2: Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount, 
        currency,
        name: "Whitehill Capital",
        description: `Disbursement for Application #${fundingId.slice(-6)}`,
        order_id,
        handler: async (response) => {
          try {
            setLoading(true);
            const verifyRes = await api.post(
              "/api/funding/payment/razorpay/complete",
              {
                fundingId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              toast.success("Disbursement done 🎉");
              onSuccess();
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Whitehill Admin",
          email: "finance@whitehillcapital.com",
        },
        theme: { color: "#1e3a8a" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="pim-overlay" onClick={onClose}>
      <div className="pim-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pim-header">
          <h2>Disburse Capital</h2>
          <button className="pim-close" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="pim-tabs">
          <button
            className={`pim-tab ${method === "manual" ? "active" : ""}`}
            onClick={() => setMethod("manual")}
          >
            <i className="fa-solid fa-file-invoice"></i> Manual Entry
          </button>
          <button
            className={`pim-tab ${method === "razorpay" ? "active" : ""}`}
            onClick={() => setMethod("razorpay")}
          >
            <i className="fa-solid fa-bolt"></i> Razorpay Instant
          </button>
        </div>

        <div className="pim-content">
          <div className="pim-amount-summary">
            <span>Amount to Disburse:</span>
            <strong>{formatAmount(approvedAmount)}</strong>
          </div>

          {method === "manual" ? (
            <form onSubmit={handleManualSubmit} className="pim-form">
              <div className="pim-form-group">
                <label>Manual Invoice ID</label>
                <input
                  type="text"
                  name="invoiceId"
                  placeholder="e.g., WH/INV/2026/001"
                  value={manualData.invoiceId}
                  onChange={handleManualInputChange}
                  required
                />
              </div>

              <div className="pim-form-group">
                <label>Bank Transaction ID / Ref</label>
                <input
                  type="text"
                  name="transactionId"
                  placeholder="UTR Number"
                  value={manualData.transactionId}
                  onChange={handleManualInputChange}
                  required
                />
              </div>

              <div className="pim-form-group">
                <label>Transfer Method</label>
                <select
                  name="payMethod"
                  value={manualData.payMethod}
                  onChange={handleManualInputChange}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IMPS">IMPS</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <button type="submit" className="pim-confirm-btn" disabled={loading}>
                {loading ? "Recording..." : "Confirm Disbursement"}
              </button>
            </form>
          ) : (
            <div className="pim-razorpay-content">
              <p>You are about to initiate an instant disbursement via Razorpay.</p>
              <button onClick={handleRazorpaySubmit} className="pim-rzp-btn" disabled={loading}>
                {loading ? "Initializing..." : "Proceed to Gateway"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;