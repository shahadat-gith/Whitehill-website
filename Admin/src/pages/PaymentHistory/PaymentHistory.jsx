import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentHistory.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import { formatAmount, formatDate } from "../../utils/utility";

const PaymentHistory = () => {
  const navigate = useNavigate();

  const [count, setCount] = useState(20);
  const [skip, setSkip] = useState(0);

  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  const [q, setQ] = useState(""); // local search within current page

  const canPrev = useMemo(() => skip > 0, [skip]);
  const canNext = useMemo(() => payments.length === Number(count), [payments, count]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/payment-gateway/history", {
        params: { count, skip },
      });

      if (data.success) {
        setPayments(data.payments || []);
      } else {
        toast.error(data.message || "Failed to load payments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, skip]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return payments;

    return payments.filter((p) => {
      const hay = [
        p.id,
        p.order_id,
        p.status,
        p.method,
        p.email,
        p.contact,
        String(p.amount || ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(query);
    });
  }, [payments, q]);

  return (
    <div className="pg-container">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h4>Payment Gateway</h4>
          <p className="pg-subtitle">Payments history (Razorpay)</p>
        </div>

        <div className="pg-actions">
          <div className="pg-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search in this page (pay_, status, email...)"
            />
          </div>

          <button className="btn btn-secondary" onClick={fetchHistory} disabled={loading}>
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

      {/* Table Card */}
      <div className="pg-card">
        <div className="pg-card-head">
          <div className="pg-card-title">
            <i className="fa-solid fa-list"></i>
            <span>Payments</span>
          </div>

          <div className="pg-pager">
            <div className="pg-count">
              <span className="pg-muted">Count</span>
              <select
                value={count}
                onChange={(e) => {
                  setSkip(0);
                  setCount(Number(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSkip((s) => Math.max(0, s - Number(count)))}
              disabled={!canPrev || loading}
            >
              <i className="fa-solid fa-chevron-left"></i>
              <span>Prev</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSkip((s) => s + Number(count))}
              disabled={!canNext || loading}
            >
              <span>Next</span>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="pg-table-wrap">
          <table className="pg-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Created</th>
                <th style={{ width: 140 }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="pg-loading-cell">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Loading payments...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="pg-empty-cell">
                    No payments found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const id = p.id;
                  const amount = p.amount != null ? p.amount / 100 : null; // paise -> INR
                  const created = p.created_at ? p.created_at * 1000 : null;

                  return (
                    <tr key={id}>
                      <td className="pg-mono">{id}</td>
                      <td className="pg-amount">{amount != null ? formatAmount(amount) : "-"}</td>
                      <td>
                        <span className={`pg-pill ${String(p.status || "").toLowerCase()}`}>
                          {p.status || "-"}
                        </span>
                      </td>
                      <td className="pg-muted">{p.method ? String(p.method).toUpperCase() : "-"}</td>
                      <td className="pg-muted">{created ? formatDate(created) : "-"}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/payment-history/${id}`)}
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
    </div>
  );
};

export default PaymentHistory;
