import React, { useState } from "react";
import api from "../../../../configs/axios";
import toast from "react-hot-toast";
import "./ProfileUpdateModal.css";
import { useAppContext } from "../../../../context/AppContext";

const ProfileUpdateModal = ({ type = "basic", onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, setUser } = useAppContext();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.image?.secure_url || "");

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      if (type === "basic") {
        payload.append("fullName", formData.fullName);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
      } else {
        if (!image) {
          setLoading(false);
          setError("Please select an image to upload");
          return;
        }
        payload.append("profileImage", image);
      }

      const { data } = await api.post("/api/user/update-profile", payload);

      if (data.success) {
        toast.success("Profile records updated");
        setUser(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pum-overlay">
      <div className="pum-container">
        <div className="pum-header">
          <div className="pum-icon">
            <i className={type === "basic" ? "fas fa-user-edit" : "fas fa-camera"}></i>
          </div>
          <h3>{type === "basic" ? "Update Details" : "Profile Picture"}</h3>
          <button className="pum-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="pum-form">
          {type === "basic" ? (
            <div className="pum-inputs">
              <div className="pum-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter full name" />
              </div>
              <div className="pum-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
              </div>
              <div className="pum-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 ..." />
              </div>
            </div>
          ) : (
            <div className="pum-upload-area">
              <div className="pum-preview-wrap">
                <img src={preview || "/user.png"} alt="Preview" className="pum-img-preview" />
                <label htmlFor="pum-file" className="pum-upload-trigger">
                  <i className="fas fa-plus"></i>
                </label>
              </div>
              <input id="pum-file" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              <p className="pum-upload-hint">Recommended: Square image, max 2MB</p>
            </div>
          )}

          {error && <div className="pum-error-msg"><i className="fas fa-circle-info"></i> {error}</div>}

          <div className="pum-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;