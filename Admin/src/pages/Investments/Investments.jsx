import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./Investments.css";
import { formatAmount,formatDate } from "../../utils/utility";

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/investment/all");

      if (data.success) {
        setInvestments(data.investments || []);
      } else {
        toast.error(data.message || "Failed to load investments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return investments;

    return investments.filter((inv) => {
      const user = inv.user || {};
      const project = inv.project || {};
      const tx = inv.transaction || {};

      const haystack = [
        user.fullName,
        project.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [investments, q]);



  return (
    <div className="inv-container">
      <div className="inv-header">
        <div>
          <h4>Investors</h4>
          <p className="inv-subtitle">All investments</p>
        </div>

        <div className="inv-actions">
          <div className="inv-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search investor, project..."
            />
          </div>

          <button className="btn btn-secondary" onClick={fetchInvestments} disabled={loading}>
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

      <div className="inv-table-wrapper">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Investor</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="inv-loading-cell">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Loading investments...</span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="inv-empty-cell">
                  No investments found
                </td>
              </tr>
            ) : (
              filtered.map((inv) => {
                const user = inv.user || {};
                const project = inv.project || {};
                const tx = inv.transaction || {};

                return (
                  <tr key={inv._id}>
                    <td>
                      <div className="inv-user">
                        <img
                          className="inv-avatar"
                          src={user?.image?.url || "/user.png"}
                          alt={user.fullName || "User"}
                        />
                        <div className="inv-user-meta">
                          <div className="inv-user-name">{user.fullName || "-"}</div>
                          <div className="inv-user-sub">
                            <span>{user.email || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="inv-project">
                        <div className="inv-project-name">{project.name || "-"}</div>
                        {project.targetReturn ? (
                          <div className="inv-muted">Target return: {project.targetReturn}</div>
                        ) : null}
                      </div>
                    </td>

                    <td className="inv-amount">{formatAmount(tx.amount)}</td>
                    <td className="inv-muted">{formatDate(tx.date)}</td>
                    <td className="inv-status">{inv.status || "-"}</td>

                    <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/investors/${inv._id}`)}
                        >
                          <i className="fa-solid fa-eye"></i>
                          <span style={{ marginLeft: 6 }}>View</span>
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

export default Investments;
