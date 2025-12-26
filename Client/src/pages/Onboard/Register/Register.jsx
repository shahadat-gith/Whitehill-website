import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import "./Register.css";
import { useAppContext } from "../../../Context/AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAppContext();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= BASIC VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    return newErrors;
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/api/user/register", formData);

      if (data.success) {
        setMessage("Account created successfully");
        localStorage.setItem("token", data.token)
        await fetchUser();
        navigate("/");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <h2 className="auth-title">CREATE ACCOUNT</h2>

        {/* Full Name */}
        <div className="input-group">
          <input
            type="text"
            name="fullName"
            placeholder="FULL NAME"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? "input-error" : ""}
          />
          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}
        </div>

        {/* Email */}
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="input-group">
          <input
            type="text"
            name="phone"
            placeholder="PHONE NUMBER"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "input-error" : ""}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <i className="fa fa-spinner fa-spin" /> Registering...
            </>
          ) : (
            "REGISTER"
          )}
        </button>

        {message && (
          <p
            className={`auth-message ${
              message.toLowerCase().includes("success")
                ? "success"
                : "error"
            }`}
          >
            {message}
          </p>
        )}

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
