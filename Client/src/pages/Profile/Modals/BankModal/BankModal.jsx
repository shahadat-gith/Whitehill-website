import React, { useState } from "react";
import "./BankModal.css";
import api from "../../../../configs/axios";
import { useAppContext } from "../../../../context/AppContext";
import toast from "react-hot-toast";

const BankModal = ({ onClose, bank }) => {
  const { setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountHolderName: bank?.accountHolderName || "",
    accountNumber: bank?.accountNumber || "",
    ifsc: bank?.ifsc || "",
    bankName: bank?.bankName || "",
    branch: bank?.branch || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/user/update-bank", formData);
      if (data.success) {
        setUser(data.user);
        toast.success("Banking records synchronized.");
        onClose();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to update records";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bm-overlay">
      <div className="bm-container">
        <div className="bm-header">
          <div className="bm-title-group">
            <div className="bm-icon-circle">
              <i className="fas fa-university"></i>
            </div>
            <div>
              <h3>{bank ? "Update Account" : "Link Bank Account"}</h3>
              <p>Ensure details match your passbook</p>
            </div>
          </div>
          <button onClick={onClose} className="bm-close-trigger">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bm-form">
          <div className="bm-group">
            <label>Legal Account Holder Name</label>
            <input
              name="accountHolderName"
              placeholder="Full name as per bank"
              value={formData.accountHolderName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bm-row">
            <div className="bm-group">
              <label>Account Number</label>
              <input
                name="accountNumber"
                type="text"
                placeholder="000000000000"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bm-group">
              <label>IFSC Identifier</label>
              <input
                name="ifsc"
                placeholder="e.g. HDFC0001234"
                value={formData.ifsc}
                onChange={handleChange}
                required
                className="bm-uppercase"
              />
            </div>
          </div>

          <div className="bm-group">
            <label>Financial Institution (Bank Name)</label>
            <input
              name="bankName"
              placeholder="e.g. HDFC Bank"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bm-group">
            <label>Branch Office</label>
            <input
              name="branch"
              placeholder="Locality or City"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bm-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i> Processing...
                </>
              ) : (
                "Save Account Details"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankModal;