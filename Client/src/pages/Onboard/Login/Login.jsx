import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import "./Login.css";
import { validateField } from "../validate";
import { useAppContext } from "../../../Context/AppContext";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
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
      const payload = formData.emailOrPhone.includes("@")
        ? { email: formData.emailOrPhone, password: formData.password }
        : { phone: formData.emailOrPhone, password: formData.password };

      const { data } = await api.post("/user/login", payload);

      if (data.success) {
        setMessage("Login successful!");
        await fetchUser()
        navigate("/")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setMessage(errorMessage);

      // Handle specific field errors from backend
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
        <h2 className="auth-title">LOGIN</h2>

        <div className="input-group">
          <input
            type="text"
            name="emailOrPhone"
            placeholder="EMAIL OR PHONE"
            value={formData.emailOrPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.emailOrPhone ? "input-error" : ""}
            required
          />
          {errors.emailOrPhone && (
            <span className="error-message">{errors.emailOrPhone}</span>
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

        <p className="forgot-password">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </p>

        <button type="submit" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        {message && (
          <p className={`auth-message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;