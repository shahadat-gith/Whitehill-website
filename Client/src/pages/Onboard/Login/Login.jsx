import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../configs/axios";
import "./Login.css";
import { useAppContext } from "../../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    email: "",
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
      const { data } = await api.post("/api/user/login", formData);

      if (data.success && data.token) {
        await login(data.token);

        setMessage("Login successful");

        setTimeout(() => {
          navigate(redirect || "/profile", { replace: true });
        }, 300);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= GO TO REGISTER ================= */
  const handleGoToRegister = () => {
    navigate(
      redirect
        ? `/register?redirect=${encodeURIComponent(redirect)}`
        : "/register"
    );
  };


  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">LOGIN</h2>

        <div className="input-group">
          <input
            type="text"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
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
          <span onClick={handleGoToRegister}>
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;