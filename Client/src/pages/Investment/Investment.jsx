import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Investment.css";
import api from "../../Configs/axios";
import Loader from "../../components/Loader/Loader";
import { useAppContext } from "../../Context/AppContext";
import { getStatusClass, formatCurrency, formatDate, getRiskClass } from "../../Utils/utility";

const Investment = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const userId = params.get("user") || user?._id;

  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchInvestments = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/investment/user/${userId}`);

        if (data.success) {
          setInvestments(data.investments);
        }
      } catch (error) {
        console.error("Fetch investments error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [userId]);

  const activeInvestments = investments.filter(
    (inv) => inv.status === "confirmed"
  ).length;

  if (loading) return <Loader />;

  return (
    <div className="inv-container">
      {/* Header */}
      <div className="inv-header">
        <div className="inv-header-content">
          <h1>My Investments</h1>
          <p>Track and manage all your investment portfolios</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="inv-stats">
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-total">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="inv-stat-content">
            <p className="inv-stat-label">Total Invested</p>
            <p className="inv-stat-value">{formatCurrency(user?.totalInvested)}</p>
          </div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-active">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="inv-stat-content">
            <p className="inv-stat-label">Active Investments</p>
            <p className="inv-stat-value">{activeInvestments}</p>
          </div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-count">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="inv-stat-content">
            <p className="inv-stat-label">Total Projects</p>
            <p className="inv-stat-value">{investments.length}</p>
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="inv-table-container">
        {investments.length === 0 ? (
          <div className="inv-empty-state">
            <i className="fas fa-folder-open"></i>
            <h3>No Investments Found</h3>
            {investments.length === 0 && (
              <button
                className="inv-btn-primary"
                onClick={() => navigate("/projects")}
              >
                <i className="fas fa-plus-circle"></i>
                Explore Projects
              </button>
            )}
          </div>
        ) : (
          <div className="inv-table-wrapper">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Investment</th>
                  <th>Target Return</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr 
                    key={inv._id}
                    onClick={() => navigate(`/project/${inv.project?._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Project */}
                    <td>
                      <div className="inv-table-project">
                        <img
                          src={
                            inv.project?.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100"
                          }
                          alt={inv.project?.name}
                        />
                        <div className="inv-table-project-info">
                          <span className="inv-table-project-name">
                            {inv.project?.name || "Project Name"}
                          </span>
                          <span className="inv-table-project-meta">
                            {inv.project?.category === "real_estate"
                              ? "Real Estate"
                              : "Startup"} • {inv.project?.city}, {inv.project?.state}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Investment */}
                    <td>
                      <span className="inv-table-amount">
                        {formatCurrency(inv.transaction?.amount || 0)}
                      </span>
                    </td>

                    {/* Target Return */}
                    <td>
                      <span className="inv-table-return">
                        {inv.project?.targetReturn || "N/A"}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`inv-table-status ${getStatusClass(inv.status)}`}>
                        {inv.status === "confirmed" ? "Active" : inv.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="inv-table-date">
                        {formatDate(inv.date)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Investment;