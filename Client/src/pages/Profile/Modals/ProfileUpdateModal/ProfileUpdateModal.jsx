import React, { useState } from "react";
import api from "../../../../Configs/axios";
import toast from "react-hot-toast";
import "./ProfileUpdateModal.css";
import { useAppContext } from "../../../../Context/AppContext";

const ProfileUpdateModal = ({ type = "basic", onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, setUser } = useAppContext();

  // Basic details state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Image state
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.image?.secure_url || "");

  /* ================= BASIC INPUT CHANGE ================= */
  const handleChange = (e) => {
    setError(""); // Clear error on input change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE CHANGE ================= */
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

  /* ================= SUBMIT ================= */
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
        toast.success("Profile updated successfully");
        setUser(data.user);
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-backdrop">
      <div className="profile-modal">
        <h3>
          {type === "basic" ? "Update Profile Details" : "Update Profile Image"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* ================= BASIC DETAILS ================= */}
          {type === "basic" && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* ================= IMAGE UPDATE ================= */}
          {type === "profile" && (
            <div className="image-upload-section">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="profile-preview"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}

          {/* ================= ERROR MESSAGE ================= */}
          {error && (
            <div className="profile-modal-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {/* ================= ACTIONS ================= */}
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn save" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;