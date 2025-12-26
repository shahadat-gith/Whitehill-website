import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Configs/axios";
import "./Login.css";
import { useAppContext } from "../../../Context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAppContext();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = formData.emailOrPhone.includes("@")
        ? { email: formData.emailOrPhone, password: formData.password }
        : { phone: formData.emailOrPhone, password: formData.password };

      const { data } = await api.post("/api/user/login", payload);

      if (data.success) {
        // ✅ Save token to localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setMessage("Login successful");
        await fetchUser();
        navigate("/");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">LOGIN</h2>

        <div className="input-group">
          <input
            type="text"
            name="emailOrPhone"
            placeholder="EMAIL OR PHONE"
            value={formData.emailOrPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <p className="forgot-password">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </p>

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <i className="fa fa-spinner fa-spin" /> Logging in...
            </>
          ) : (
            "LOGIN"
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
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
