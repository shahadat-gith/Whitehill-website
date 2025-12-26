import React, { useState, useRef } from "react";
import "./KycModal.css";
import api from "../../../../Configs/axios";
import { useAppContext } from "../../../../Context/AppContext";

const KycModal = ({ user, onClose }) => {
  const { setUser } = useAppContext();

  const [formData, setFormData] = useState({
    aadharNumber: user?.kyc?.aadhar?.aadharNumber || "",
    panNumber: user?.kyc?.pan?.panNumber || "",
    aadharFront: null,
    aadharBack: null,
    panFront: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs for file inputs
  const aadharFrontRef = useRef(null);
  const aadharBackRef = useRef(null);
  const panFrontRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("aadharNumber", formData.aadharNumber);
      payload.append("panNumber", formData.panNumber);
      payload.append("aadharFront", formData.aadharFront);
      payload.append("aadharBack", formData.aadharBack);
      payload.append("panFront", formData.panFront);

      const { data } = await api.post("/api/user/kyc", payload);

      if (data.success) {
        setUser(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update KYC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-modal-backdrop">
      <div className="kyc-modal">
        <div className="kyc-modal-header">
          <h2>Update KYC Details</h2>
          <button className="kyc-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className="kyc-modal-form" onSubmit={handleSubmit}>
          {/* ================= AADHAAR ================= */}
          <div className="kyc-modal-section">
            <h3>Aadhaar Details</h3>

            <div className="kyc-grid-3">
              <div className="kyc-field">
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  maxLength={12}
                  required
                  value={formData.aadharNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="kyc-field">
                <label>Aadhaar Front Image</label>
                <input
                  ref={aadharFrontRef}
                  type="file"
                  name="aadharFront"
                  accept="image/*"
                  required
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="kyc-file-picker-btn"
                  onClick={() => aadharFrontRef.current.click()}
                >
                  <i className="fas fa-upload"></i>
                  Choose File
                </button>
                {formData.aadharFront && (
                  <div className="kyc-file-selected">
                    <i className="fas fa-check-circle"></i>
                    {formData.aadharFront.name}
                  </div>
                )}
              </div>

              <div className="kyc-field">
                <label>Aadhaar Back Image</label>
                <input
                  ref={aadharBackRef}
                  type="file"
                  name="aadharBack"
                  accept="image/*"
                  required
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="kyc-file-picker-btn"
                  onClick={() => aadharBackRef.current.click()}
                >
                  <i className="fas fa-upload"></i>
                  Choose File
                </button>
                {formData.aadharBack && (
                  <div className="kyc-file-selected">
                    <i className="fas fa-check-circle"></i>
                    {formData.aadharBack.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= PAN ================= */}
          <div className="kyc-modal-section">
            <h3>PAN Details</h3>

            <div className="kyc-grid-2">
              <div className="kyc-field">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  maxLength={10}
                  required
                  value={formData.panNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="kyc-field">
                <label>PAN Front Image</label>
                <input
                  ref={panFrontRef}
                  type="file"
                  name="panFront"
                  accept="image/*"
                  required
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="kyc-file-picker-btn"
                  onClick={() => panFrontRef.current.click()}
                >
                  <i className="fas fa-upload"></i>
                  Choose File
                </button>
                {formData.panFront && (
                  <div className="kyc-file-selected">
                    <i className="fas fa-check-circle"></i>
                    {formData.panFront.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <p className="kyc-modal-error">{error}</p>}

          <div className="kyc-modal-actions">
            <button
              type="button"
              className="kyc-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="kyc-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                "Save KYC"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KycModal;