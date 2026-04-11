import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./Funding.css";
import { formatCurrency, formatDate } from "../../utils/utility";

const Funding = () => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const navigate = useNavigate();

  const fetchFundings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterType !== "all") params.append("type", filterType);

      const { data } = await api.get(`/api/admin/funding/all?${params.toString()}`);

      if (data.success || data.data) {
        setFundings(data.data || []);
      } else {
        toast.error(data.message || "Failed to load funding requests");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundings();
  }, [filterStatus, filterType]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return fundings;

    return fundings.filter((fund) => {
      const user = fund.user || {};
      const haystack = [
        user.fullName,
        user.email,
        fund.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [fundings, q]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "under_review":
        return "warning";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "startup":
        return "🚀 Startup";
      case "business":
        return "💼 Business";
      case "property":
        return "🏠 Property";
      default:
        return type;
    }
  };

  return (
    <div className="funding-container">
      {/* Header */}
      <div className="funding-header">
        <div>
          <h4>Funding Requests</h4>
          <p className="funding-subtitle">Manage and verify funding applications</p>
        </div>

        <div className="funding-actions">
          <div className="funding-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email..."
            />
          </div>

          <button className="btn btn-secondary" onClick={fetchFundings} disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-rotate"></i>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="funding-filters">
        <div className="filter-group">
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="startup">Startup</option>
            <option value="business">Business</option>
            <option value="property">Property</option>
          </select>
        </div>

        <div className="filter-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{fundings.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Showing</span>
            <span className="stat-value">{filtered.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="funding-table-wrapper">
        <table className="funding-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Type</th>
              <th>Amount Requested</th>
              <th>Status</th>
              <th>Submitted</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="funding-loading-cell">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Loading funding requests...</span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="funding-empty-cell">
                  No funding requests found
                </td>
              </tr>
            ) : (
              filtered.map((fund) => {
                const user = fund.user || {};
                const amount = fund.fundDetails?.amount || 0;

                return (
                  <tr key={fund._id}>
                    <td>
                      <div className="funding-user">
                        <img
                          className="funding-avatar"
                          src={user?.image?.url || "/user.png"}
                          alt={user.fullName || "User"}
                        />
                        <div className="funding-user-meta">
                          <div className="funding-user-name">{user.fullName || "-"}</div>
                          <div className="funding-user-email">{user.email || "-"}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="funding-type-badge">{getTypeLabel(fund.type)}</span>
                    </td>

                    <td>
                      <span className="funding-amount">{formatCurrency(amount)}</span>
                    </td>

                    <td>
                      <span className={`funding-status funding-status-${getStatusColor(fund.status)}`}>
                        {fund.status?.replace("_", " ").toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <span className="funding-date">{formatDate(fund.createdAt)}</span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/funding/${fund._id}`)}
                        title="View and verify"
                      >
                        <i className="fa-solid fa-eye"></i>
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funding;
