import React, { useState } from "react";
import api from "../../../Configs/axios";
import "./KYC.css";
import { useAppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";

const KYC = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const [formData, setFormData] = useState({
    aadharNumber: "",
    panNumber: "",
    aadharFrontImage: null,
    aadharBackImage: null,
    panFrontImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("aadharNumber", formData.aadharNumber);
      payload.append("panNumber", formData.panNumber);

      payload.append("aadharFront", formData.aadharFrontImage);
      payload.append("aadharBack", formData.aadharBackImage);
      payload.append("panFront", formData.panFrontImage);

      const { data } = await api.post("/api/user/kyc", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setUser(data.user);
        setMessage("KYC submitted successfully. Verification in progress.");

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit KYC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-page">
      <div className="kyc-container">
        <div className="kyc-header">
          <div className="kyc-header-icon">
            <i className="fa fa-user-shield"></i>
          </div>
          <h1 className="kyc-title">Complete Your KYC</h1>
          <p className="kyc-subtitle">
            Capture and upload clear photos of your documents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="kyc-form">
          {/* ================= AADHAAR ================= */}
          <div className="kyc-section">
            <h2 className="kyc-section-title">Aadhaar Details</h2>

            <div className="kyc-form-group">
              <label className="kyc-label">Aadhaar Number</label>
              <input
                type="text"
                name="aadharNumber"
                className="kyc-input"
                maxLength="12"
                placeholder="12-digit Aadhaar number"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Front */}
            <div className="kyc-form-group">
              <label className="kyc-label">Aadhaar Front</label>
              <input
                type="file"
                name="aadharFrontImage"
                accept="image/*"
                capture="environment"
                className="kyc-file-input"
                onChange={handleChange}
                required
              />
            </div>

            {/* Back */}
            <div className="kyc-form-group">
              <label className="kyc-label">Aadhaar Back</label>
              <input
                type="file"
                name="aadharBackImage"
                accept="image/*"
                capture="environment"
                className="kyc-file-input"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ================= PAN ================= */}
          <div className="kyc-section">
            <h2 className="kyc-section-title">PAN Details</h2>

            <div className="kyc-form-group">
              <label className="kyc-label">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                className="kyc-input"
                maxLength="10"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="kyc-form-group">
              <label className="kyc-label">PAN Front</label>
              <input
                type="file"
                name="panFrontImage"
                accept="image/*"
                capture="environment"
                className="kyc-file-input"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ================= SUBMIT ================= */}
          <div className="kyc-actions">
            <button type="submit" className="kyc-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fa fa-check-circle"></i> Submit KYC
                </>
              )}
            </button>
          </div>

          {message && (
            <div className="kyc-message">
              <i className="fa fa-info-circle"></i> {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default KYC;
