import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import "./Register.css";
import { validateField } from "../validate";
import { useAppContext } from "../../../Context/AppContext";
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {fetchUser} = useAppContext()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Clear general message
    if (message) {
      setMessage("");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate all fields
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/user/register", formData);
      if (data.success) {
        setMessage("Account created successfully!");
        await fetchUser()
        navigate("/")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      setMessage(errorMessage);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <h2 className="auth-title">CREATE ACCOUNT</h2>

        <div className="input-group">
          <input
            type="text"
            name="fullName"
            placeholder="FULL NAME"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.fullName ? "input-error" : ""}
            required
          />
          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email ? "input-error" : ""}
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="input-group">
          <input
            type="text"
            name="phone"
            placeholder="PHONE NUMBER"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.phone ? "input-error" : ""}
            required
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password ? "input-error" : ""}
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "REGISTERING..." : "REGISTER"}
        </button>

        {message && (
          <p className={`auth-message ${message.includes("success") ? "success" : "error"}`}>
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