import { useState } from "react";
import "./BankModal.css";
import api from "../../../../Configs/axios";
import { useAppContext } from "../../../../Context/AppContext";
import toast from "react-hot-toast"

const BankModal = ({ onClose, bank }) => {
  const { setUser } = useAppContext();

  const [formData, setFormData] = useState({
    accountHolderName: bank?.accountHolderName || "",
    accountNumber: bank?.accountNumber || "",
    ifsc: bank?.ifsc || "",
    bankName: bank?.bankName || "",
    branch: bank?.branch || "",
  });

  const [loading, setLoading] = useState(false);

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
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update bank details";

    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="prf-modal-overlay">
      <div className="prf-modal">
        <div className="prf-modal-header">
          <h3>{bank ? "Update Bank Details" : "Add Bank Details"}</h3>
          <button onClick={onClose} className="prf-modal-close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="prf-modal-body">
          <input
            name="accountHolderName"
            placeholder="Account Holder Name"
            value={formData.accountHolderName}
            onChange={handleChange}
            required
          />
          <input
            name="accountNumber"
            placeholder="Account Number"
            value={formData.accountNumber}
            onChange={handleChange}
            required
          />
          <input
            name="ifsc"
            placeholder="IFSC Code"
            value={formData.ifsc}
            onChange={handleChange}
            required
          />
          <input
            name="bankName"
            placeholder="Bank Name"
            value={formData.bankName}
            onChange={handleChange}
            required
          />
          <input
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
            required
          />

          <div className="prf-modal-actions">
            <button
              type="submit"
              className="prf-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                "Save Bank Details"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankModal;
