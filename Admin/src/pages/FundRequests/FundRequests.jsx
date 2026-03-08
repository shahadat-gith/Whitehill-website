import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FundRequests.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/utility";

const FundRequests = () => {
  const [fundRequests, setFundRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const fetchFundRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/fund-requests/all");

      if (data?.success) {
        setFundRequests(data.data || []);
      } else {
        toast.error(data?.message || "Failed to load fund requests");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundRequests();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return fundRequests;

    return fundRequests.filter((request) => {
      const haystack = [
        request.name,
        request.status,
        request.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [fundRequests, q]);

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="fr-container">
      <div className="fr-header">
        <h1>Fund Requests Management</h1>
        <div className="fr-search">
          <input
            type="text"
            placeholder="Search by project name or type..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="fr-search-input"
          />
        </div>
      </div>

      <div className="fr-content">
        {loading ? (
          <div className="fr-loading">
            <div className="spinner"></div>
            <p>Loading fund requests...</p>
          </div>
        ) : (
          <div className="fr-table-container">
            <table className="fr-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Type</th>
                  <th>Amount Requested</th>
                  <th>Amount Allocated</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((request) => (
                    <tr key={request._id}>
                      <td className="fr-project-name">{request.name}</td>
                      <td>
                        <span className={`fr-type-badge ${request.type}`}>
                          {request.type === 'startup' ? 'Startup' : 'Business'}
                        </span>
                      </td>
                      <td className="fr-amount">{formatCurrency(request.amountRequested)}</td>
                      <td className="fr-amount-alloted">
                        {request.amountAlloted ? formatCurrency(request.amountAlloted) : <span className="text-muted">-</span>}
                      </td>
                      <td>
                        <span className={`fr-status-pill ${getStatusClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="fr-manage-btn"
                          onClick={() => navigate(`/fund-requests/${request._id}`)}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="fr-empty">No fund requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundRequests;