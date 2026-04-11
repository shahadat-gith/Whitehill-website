import React, { useState, useRef } from "react";
import "./KycModal.css";
import api from "../../../../configs/axios";
import { useAppContext } from "../../../../context/AppContext";
import toast from "react-hot-toast";

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
        toast.success("Identity verification documents submitted.");
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification sync failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="km-overlay">
      <div className="km-container">
        <div className="km-header">
          <div className="km-title-group">
            <div className="km-icon-badge">
              <i className="fas fa-shield-halved"></i>
            </div>
            <div>
              <h3>Identity Verification</h3>
              <p>Secure document upload for KYC compliance</p>
            </div>
          </div>
          <button className="km-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className="km-form" onSubmit={handleSubmit}>
          {/* ── AADHAAR SECTION ── */}
          <div className="km-section">
            <div className="km-section-head">
              <i className="fas fa-address-card"></i>
              <h4>Aadhaar Details</h4>
            </div>

            <div className="km-field">
              <label>Aadhaar Number (12 Digits)</label>
              <input
                type="text"
                name="aadharNumber"
                placeholder="0000 0000 0000"
                maxLength={12}
                required
                value={formData.aadharNumber}
                onChange={handleChange}
              />
            </div>

            <div className="km-upload-grid">
              <div className="km-upload-box">
                <label>Front Image</label>
                <input ref={aadharFrontRef} type="file" name="aadharFront" accept="image/*" required onChange={handleChange} style={{ display: "none" }} />
                <button type="button" className={`km-picker ${formData.aadharFront ? 'success' : ''}`} onClick={() => aadharFrontRef.current.click()}>
                  <i className={`fas ${formData.aadharFront ? 'fa-check-circle' : 'fa-cloud-arrow-up'}`}></i>
                  <span>{formData.aadharFront ? "Front Selected" : "Upload Front"}</span>
                </button>
              </div>

              <div className="km-upload-box">
                <label>Back Image</label>
                <input ref={aadharBackRef} type="file" name="aadharBack" accept="image/*" required onChange={handleChange} style={{ display: "none" }} />
                <button type="button" className={`km-picker ${formData.aadharBack ? 'success' : ''}`} onClick={() => aadharBackRef.current.click()}>
                  <i className={`fas ${formData.aadharBack ? 'fa-check-circle' : 'fa-cloud-arrow-up'}`}></i>
                  <span>{formData.aadharBack ? "Back Selected" : "Upload Back"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── PAN SECTION ── */}
          <div className="km-section">
            <div className="km-section-head">
              <i className="fas fa-id-badge"></i>
              <h4>PAN Details</h4>
            </div>

            <div className="km-grid-2">
              <div className="km-field">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  required
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="km-uppercase"
                />
              </div>

              <div className="km-upload-box">
                <label>PAN Front Image</label>
                <input ref={panFrontRef} type="file" name="panFront" accept="image/*" required onChange={handleChange} style={{ display: "none" }} />
                <button type="button" className={`km-picker ${formData.panFront ? 'success' : ''}`} onClick={() => panFrontRef.current.click()}>
                  <i className={`fas ${formData.panFront ? 'fa-check-circle' : 'fa-cloud-arrow-up'}`}></i>
                  <span>{formData.panFront ? "PAN Selected" : "Upload Image"}</span>
                </button>
              </div>
            </div>
          </div>

          {error && <div className="km-error-alert"><i className="fas fa-triangle-exclamation"></i> {error}</div>}

          <div className="km-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><i className="fas fa-circle-notch fa-spin"></i> Processing...</> : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KycModal;