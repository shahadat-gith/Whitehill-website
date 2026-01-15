import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/user/all");

      if (data?.success) {
        setUsers(data.users || []);
      } else {
        toast.error(data?.message || "Failed to load users");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;

    return users.filter((u) => {
      const haystack = [
        u.fullName,
        u.email,
        u.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [users, q]);

  const getKycTone = (st) => {
    const s = String(st || "pending").toLowerCase();
    if (s === "verified") return "ok";
    if (s === "rejected") return "danger";
    return "warn";
  };

  return (
    <div className="us-container">
      <div className="us-header">
        <div>
          <h4>Users</h4>
          <p className="us-subtitle">All registered users</p>
        </div>

        <div className="us-actions">
          <div className="us-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, phone..."
            />
          </div>

          <button className="btn btn-secondary" onClick={fetchUsers} disabled={loading}>
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

      <div className="us-table-wrapper">
        <table className="us-table">
          <thead>
            <tr>
              <th>User</th>
              <th>KYC</th>
              <th>Invested</th>
              <th>Portfolio</th>
              <th style={{ width: 140 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="us-loading-cell">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Loading users...</span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="us-empty-cell">
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const kycStatus = u.kyc?.status || "pending";
                const accStatus = u.accountStatus || "active";

                return (
                  <tr key={u._id}>
                    <td>
                      <div className="us-user">
                        <img
                          className="us-avatar"
                          src={u?.image?.url || "/user.png"}
                          alt={u.fullName || "User"}
                        />
                        <div className="us-user-meta">
                          <div className="us-user-name">{u.fullName || "-"}</div>
                          <div className="us-user-sub">
                            <span>{u.email || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`us-pill ${getKycTone(kycStatus)}`}>
                        {String(kycStatus).toUpperCase()}
                      </span>
                    </td>
                    <td className="us-strong">₹{Number(u.totalInvested || 0).toLocaleString("en-IN")}</td>
                    <td>₹{Number(u.portfolioValue || 0).toLocaleString("en-IN")}</td>

                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/users/${u._id}`)}
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

export default Users;
