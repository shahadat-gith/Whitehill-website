import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import QueryModal from "./QueryModal";

const Home = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  const [openQueryModal, setOpenQueryModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const handleQueryModal = (query) => {
    setOpenQueryModal(true);
    setSelectedQuery(query);
  };

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/dashboard/stats");

      if (data?.success) {
        setDashboard(data.dashboard);
      } else {
        toast.error(data?.message || "Failed to load dashboard");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const view = useMemo(() => {
    const d = dashboard || {};
    return {
      stats: d.stats || {},
      recentInvestments: d.recentInvestments || [],
      recentUsers: d.recentUsers || [],
      recentQueries: d.recentQueries || [],
    };
  }, [dashboard]);

  const formatINR = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const kycTone = (s) => {
    const st = String(s || "").toLowerCase();
    if (st === "verified") return "ok";
    if (st === "rejected") return "danger";
    return "warn";
  };

  return (
    <div className="hm-container">
      <div className="hm-header">
        <div>
          <h2>Dashboard</h2>
        </div>

        <button
          className="btn btn-secondary"
          onClick={fetchDashboard}
          disabled={loading}
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
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

      {/* Stats */}
      <div className="hm-stats">
        <div className="hm-stat">
          <div className="hm-stat-label">Total Projects</div>
          <div className="hm-stat-value">{view.stats.totalProjects || 0}</div>
          <div className="hm-stat-sub">
            {view.stats.activeProjects || 0} active
          </div>
        </div>

        <div className="hm-stat">
          <div className="hm-stat-label">Total Users</div>
          <div className="hm-stat-value">{view.stats.totalUsers || 0}</div>
          <div className="hm-stat-sub">
            {view.stats.kycPending || 0} KYC pending
          </div>
        </div>

        <div className="hm-stat">
          <div className="hm-stat-label">Total Investments</div>
          <div className="hm-stat-value">{view.stats.totalInvestments || 0}</div>
          <div className="hm-stat-sub">
            {view.stats.pendingInvestments || 0} pending
          </div>
        </div>

        <div className="hm-stat">
          <div className="hm-stat-label">Amount Invested</div>
          <div className="hm-stat-value">
            {formatINR(view.stats.totalAmountInvested)}
          </div>
          <div className="hm-stat-sub">
            Distributions: {formatINR(view.stats.totalDistributions)}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="hm-grid">
        {/* Recent Investments */}
        <div className="hm-card hm-span-2">
          <div className="hm-card-head">
            <h4>Recent Investments</h4>
            <span className="hm-muted">Latest activity</span>
          </div>

          {/* ✅ remove horizontal scroll for 3 cols */}
          <div className="hm-table-wrap hm-table-wrap-tight">
            <table className="hm-table hm-table-tight">
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Project</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {loading && !dashboard ? (
                  <tr>
                    <td colSpan="3" className="hm-muted" style={{ padding: 14 }}>
                      <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                      Loading investments...
                    </td>
                  </tr>
                ) : view.recentInvestments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="hm-muted" style={{ padding: 14 }}>
                      No investments found
                    </td>
                  </tr>
                ) : (
                  view.recentInvestments.map((inv) => (
                    <tr
                      key={inv._id}
                      className="hm-row-click"
                      onClick={() => navigate(`/investments/${inv._id}`)}
                      title="View investment"
                    >
                      <td>
                        <div className="hm-cell-strong">
                          {inv.user?.fullName || "-"}
                        </div>
                        <div className="hm-muted">{inv.user?.email || "-"}</div>
                      </td>

                      <td>
                        <div className="hm-cell-strong">
                          {inv.project?.name || "-"}
                        </div>
                        <div className="hm-muted">
                          {inv.project?.category || "-"}
                        </div>
                      </td>

                      <td className="hm-cell-strong">
                        {formatINR(inv.transaction?.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Users */}
        <div className="hm-card">
          <div className="hm-card-head">
            <h4>New Users</h4>
            <span className="hm-muted">Recently registered</span>
          </div>

          <div className="hm-list">
            {loading && !dashboard ? (
              <div className="hm-muted" style={{ padding: 12 }}>
                <i className="fa-solid fa-spinner fa-spin"></i> Loading users...
              </div>
            ) : view.recentUsers.length === 0 ? (
              <div className="hm-muted" style={{ padding: 12 }}>
                No users found
              </div>
            ) : (
              view.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="hm-list-item hm-row-click"
                  onClick={() => navigate(`/users/${u._id}`)}
                  title="View user"
                >
                  <div className="hm-list-main">
                    <div className="hm-cell-strong">{u.fullName || "-"}</div>
                    <div className="hm-muted">{u.email || "-"}</div>
                  </div>

                  <div className="hm-list-right">
                    <span className={`hm-pill ${kycTone(u.kyc?.status)}`}>
                      {String(u.kyc?.status || "pending").toUpperCase()}
                    </span>
                    <div className="hm-muted hm-date">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="hm-card hm-span-2" style={{ gridColumn: "1 / -1" }}>
          <div className="hm-card-head">
            <h4>Recent Queries</h4>
            <span className="hm-muted">Latest contact/enquiry messages</span>
          </div>

          <div className="hm-table-wrap">
            <table className="hm-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && !dashboard ? (
                  <tr>
                    <td colSpan="4" className="hm-muted" style={{ padding: 14 }}>
                      <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                      Loading queries...
                    </td>
                  </tr>
                ) : view.recentQueries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="hm-muted" style={{ padding: 14 }}>
                      No queries found
                    </td>
                  </tr>
                ) : (
                  view.recentQueries.map((q) => {
                    const replied = Boolean(String(q.reply || "").trim());
                    const msg = String(q.message || "");
                    return (
                      <tr key={q._id}>
                        <td>
                          <div className="hm-cell-strong">{q.name || "-"}</div>
                          <div className="hm-muted">{q.email || "-"}</div>
                          <div className="hm-muted">{q.phone || "-"}</div>
                        </td>

                        <td>
                          <div className="hm-cell-strong" style={{ fontWeight: 800 }}>
                            {msg.slice(0, 100)}
                            {msg.length > 100 ? "..." : ""}
                          </div>
                        </td>

                        <td className="hm-muted">
                          {q.createdAt
                            ? new Date(q.createdAt).toLocaleString("en-IN")
                            : "-"}
                        </td>

                        <td>
                          {replied ? (
                            <button type="button" className="hm-action hm-action-ok" disabled>
                              <i className="fa-solid fa-circle-check"></i>
                              <span>Replied</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="hm-action hm-action-warn"
                              onClick={() => handleQueryModal(q)}
                            >
                              <i className="fa-solid fa-reply"></i>
                              <span>Reply</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <QueryModal
        isOpen={openQueryModal}
        query={selectedQuery}
        onClose={(refresh) => {
          setOpenQueryModal(false);
          setSelectedQuery(null);
          if (refresh) fetchDashboard();
        }}
      />
    </div>
  );
};

export default Home;
