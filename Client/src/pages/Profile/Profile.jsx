// Profile.js
import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useAppContext } from "../../Context/AppContext";
import Loader from "../../components/Loader/Loader";
import { formatCurrency, getStatusColor } from "../../Utils/utility";
import Personal from "./Tabs/Personal/Personal";
import KycDetails from "./Tabs/KYC/KycDetails";
import Bank from "./Tabs/Bank/Bank";
import FundRequests from "./Tabs/FundRequests/FundRequests";
import PropertySelling from "./Tabs/PropertySelling/PropertySelling";
import ProfileUpdateModal from "./Modals/ProfileUpdateModal/ProfileUpdateModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../Configs/axios";

const Profile = () => {
  const { loading, user } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [fundRequests, setFundRequests] = useState([]);
  const [propertySellings, setPropertySellings] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const TABS = ["personal", "kyc", "bank", "fund-requests", "property-selling", "settings"];
  const activeTab = TABS.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "personal";

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };


  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setLoadingRequests(true);
      try {
        const [fundRes, propertyRes] = await Promise.all([
          api.get("/api/fund-request"),
          api.get("/api/property-selling")
        ]);
        setFundRequests(fundRes.data.data || []);
        setPropertySellings(propertyRes.data.data || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchUserData();
  }, [user]);

  const tabs = [
    { key: "personal", icon: "fa-user", label: "Personal Info" },
    { key: "kyc", icon: "fa-id-card", label: "KYC Details" },
    { key: "bank", icon: "fa-university", label: "Bank Details" },
    ...(fundRequests.length > 0 ? [{ key: "fund-requests", icon: "fa-hand-holding-usd", label: "Fund Requests" }] : []),
    ...(propertySellings.length > 0 ? [{ key: "property-selling", icon: "fa-home", label: "Property Selling" }] : []),
  ]

  if (loading) return <Loader />;

  // Safe initials
  const initials =
    user?.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="prf-profile-container">
      {/* ================= HEADER ================= */}
      <div className="prf-profile-header">
        <div className="prf-profile-header-content">
          {/* LEFT SIDE */}
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

          <div className="prf-profile-header-info">
            <h1>{user?.fullName}</h1>
            <p className="prf-profile-email">{user.email}</p>

            <div className="prf-profile-badges">
              <span className={`prf-badge ${getStatusColor(user.accountStatus)}`}>
                {user.accountStatus}
              </span>

              {user?.kyc && (
                <span className={`prf-badge ${getStatusColor(user.kyc.status)}`}>
                  KYC: {user.kyc.status}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT SIDE BUTTON */}
          <div className="prf-profile-header-action">
            <button
              className="prf-btn-investments"
              onClick={() => navigate(`/investment-profile?user=${user._id}`)}
            >
              <i className="fas fa-briefcase"></i> My Investments
            </button>
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
                {formatCurrency(user.totalInvested)}
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
                {formatCurrency(user.portfolioValue)}
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
                {formatCurrency(user.totalDistributions)}
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
        {activeTab === "fund-requests" && <FundRequests fundRequests={fundRequests} />}
        {activeTab === "property-selling" && <PropertySelling propertySellings={propertySellings} />}
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
