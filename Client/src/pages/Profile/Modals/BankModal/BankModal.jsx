import React, { useState } from "react";
import "./BankModal.css";
import api from "../../../../Configs/axios";
import { useAppContext } from "../../../../Context/AppContext";
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
        toast.success("Bank details updated successfully!");
        onClose();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update bank details";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bm-modal-overlay">
      <div className="bm-modal-container">
        <div className="bm-modal-header">
          <div className="bm-header-title">
            <i className="fas fa-university"></i>
            <h3>{bank ? "Update Bank Details" : "Add Bank Details"}</h3>
          </div>
          <button onClick={onClose} className="bm-modal-close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bm-modal-form">
          <div className="bm-form-group">
            <label>Account Holder Name</label>
            <input
              name="accountHolderName"
              placeholder="As per bank records"
              value={formData.accountHolderName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bm-form-row">
            <div className="bm-form-group">
              <label>Account Number</label>
              <input
                name="accountNumber"
                type="password"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bm-form-group">
              <label>IFSC Code</label>
              <input
                name="ifsc"
                placeholder="e.g. SBIN0001234"
                value={formData.ifsc}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="bm-form-group">
            <label>Bank Name</label>
            <input
              name="bankName"
              placeholder="e.g. State Bank of India"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bm-form-group">
            <label>Branch</label>
            <input
              name="branch"
              placeholder="Branch location"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bm-modal-footer">
            <button type="button" onClick={onClose} className="bm-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="bm-btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i> Saving...
                </>
              ) : (
                "Save Details"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankModal;