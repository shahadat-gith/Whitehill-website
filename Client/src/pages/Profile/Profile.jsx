import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useAppContext } from "../../context/AppContext";
import Loader from "../../components/Loader/Loader";
import { formatCurrency, getStatusColor } from "../../Utils/utility";
import Personal from "./Tabs/Personal/Personal";
import KycDetails from "./Tabs/KYC/KycDetails";
import Bank from "./Tabs/Bank/Bank";
import ProfileUpdateModal from "./Modals/ProfileUpdateModal/ProfileUpdateModal";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Profile = () => {
  const { loading, user } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const TABS = ["personal", "kyc", "bank"];

  const activeTab = TABS.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "personal";

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };



  // Tabs config
  const tabs = [
    { key: "personal", icon: "fa-user", label: "Personal" },
    { key: "kyc", icon: "fa-id-card", label: "KYC" },
    { key: "bank", icon: "fa-university", label: "Bank" },
  ];

  const initials =
    user?.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  if (loading) return <Loader />;


  return (
    <div className="prf-profile-container">
      {/* ================= HEADER ================= */}
      <div className="prf-profile-header">
        <div className="prf-profile-header-content">

          {/* AVATAR */}
          <div className="prf-profile-avatar-section">
            <div className="prf-profile-avatar">
              {user?.image?.url ? (
                <img src={user.image.url} alt={user.fullName} />
              ) : (
                <span className="prf-avatar-initials">{initials}</span>
              )}
            </div>

            <button
              className="prf-btn-upload"
              onClick={() => setShowProfileModal(true)}
            >
              <i className="fas fa-upload"></i>{" "}
              {user?.image?.url ? "Change Photo" : "Upload Photo"}
            </button>
          </div>

          {/* INFO */}
          <div className="prf-profile-header-info">
            <h1>{user?.fullName}</h1>
            <p className="prf-profile-email">{user?.email}</p>

            <div className="prf-profile-badges">
              <span className={`prf-badge ${getStatusColor(user?.accountStatus)}`}>
                {user?.accountStatus}
              </span>

              {user?.kyc && (
                <span className={`prf-badge ${getStatusColor(user?.kyc.status)}`}>
                  KYC: {user?.kyc.status}
                </span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="prf-profile-header-action-group">
            <nav className="prf-header-nav">
              <Link to={`/funding/${user?._id}`} className="prf-nav-item">
                <span>Funding</span>
              </Link>
              <Link to={`/sold-property/${user?._id}`} className="prf-nav-item">
                <span>Properties</span>
              </Link>
              <Link to={`/investments/${user?._id}`} className="prf-nav-item">
                <span>Portfolio</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="prf-profile-stats">
          <div className="prf-stat-card prf-stat-invested">
            <div className="prf-stat-icon">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="prf-stat-content">
              <p className="prf-stat-label">Total Invested</p>
              <p className="prf-stat-value">
                {formatCurrency(user?.totalInvested)}
              </p>
            </div>
          </div>

          <div className="prf-stat-card prf-stat-portfolio">
            <div className="prf-stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="prf-stat-content">
              <p className="prf-stat-label">Portfolio Value</p>
              <p className="prf-stat-value">
                {formatCurrency(user?.portfolioValue)}
              </p>
            </div>
          </div>

          <div className="prf-stat-card prf-stat-distributions">
            <div className="prf-stat-icon">
              <i className="fas fa-hand-holding-usd"></i>
            </div>
            <div className="prf-stat-content">
              <p className="prf-stat-label">Total Distributions</p>
              <p className="prf-stat-value">
                {formatCurrency(user?.totalDistributions)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="prf-profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`prf-tab ${activeTab === tab.key ? "prf-active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`fas ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="prf-profile-content">
        {activeTab === "personal" && <Personal user={user} />}
        {activeTab === "kyc" && <KycDetails user={user} />}
        {activeTab === "bank" && <Bank user={user} />}
      </div>

      {/* ================= MODAL ================= */}
      {showProfileModal && (
        <ProfileUpdateModal
          type="profile"
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;