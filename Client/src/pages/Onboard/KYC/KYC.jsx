import React, { useState } from "react";
import api from "../../../Configs/axios";
import "./KYC.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import ImagePicker from "../../../components/ImagePicker/ImagePicker";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

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
          navigate("/profile", { replace: true });
        }, 1000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit KYC");
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
            Upload valid identity documents for verification
          </p>
        </div>

        <form className="kyc-form" onSubmit={handleSubmit}>
          {/* ================= AADHAAR ================= */}
          <div className="kyc-section">
            <h2 className="kyc-section-title">Aadhaar Details</h2>

            <div className="kyc-form-group">
              <label className="kyc-label">Aadhaar Number</label>
              <input
                className="kyc-input"
                value={formData.aadharNumber}
                onChange={(e) =>
                  setFormData({ ...formData, aadharNumber: e.target.value })
                }
                maxLength={12}
                required
              />
            </div>

            <ImagePicker
              label="Aadhaar Front Image"
              file={formData.aadharFrontImage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aadharFrontImage: e.target.files[0],
                })
              }
              onClear={() =>
                setFormData({ ...formData, aadharFrontImage: null })
              }
            />

            <ImagePicker
              label="Aadhaar Back Image"
              file={formData.aadharBackImage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aadharBackImage: e.target.files[0],
                })
              }
              onClear={() =>
                setFormData({ ...formData, aadharBackImage: null })
              }
            />
          </div>

          {/* ================= PAN ================= */}
          <div className="kyc-section">
            <h2 className="kyc-section-title">PAN Details</h2>

            <div className="kyc-form-group">
              <label className="kyc-label">PAN Number</label>
              <input
                className="kyc-input"
                value={formData.panNumber}
                onChange={(e) =>
                  setFormData({ ...formData, panNumber: e.target.value })
                }
                maxLength={10}
                required
              />
            </div>

            <ImagePicker
              label="PAN Card Image"
              file={formData.panFrontImage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  panFrontImage: e.target.files[0],
                })
              }
              onClear={() =>
                setFormData({ ...formData, panFrontImage: null })
              }
            />
          </div>

          <div className="kyc-actions">
            <button className="kyc-submit-btn" disabled={loading}>
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
            <div
              className={`kyc-message ${
                message.includes("success")
                  ? "kyc-message-success"
                  : "kyc-message-error"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default KYC;
