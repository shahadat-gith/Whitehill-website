import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PropertySelling.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/utility";

const PropertySelling = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/property-selling/all");

      if (data?.success) {
        setProperties(data.data || []);
      } else {
        toast.error(data?.message || "Failed to load property sellings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return properties;

    return properties.filter((property) => {
      const haystack = [
        property.seller?.fullName,
        property.seller?.email,
        property.type,
        property.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [properties, q]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const getTypeLabel = (type) => {
    return type === 'land' ? 'Land' : 'Property';
  };

  return (
    <div className="ps-container">
      <div className="ps-header">
        <h1>Property Selling Management</h1>
        <div className="ps-search">
          <input
            type="text"
            placeholder="Search by name, email or type..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="ps-search-input"
          />
        </div>
      </div>

      <div className="ps-content">
        {loading ? (
          <div className="ps-loading">
            <div className="spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : (
          <div className="ps-table-container">
            <table className="ps-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Type</th>
                  <th>Price Asked</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((property) => (
                    <tr key={property._id}>
                      <td>
                        <div className="ps-user-info">
                          <div className="ps-user-name">{property.seller?.fullName || 'N/A'}</div>
                          <div className="ps-user-email">{property.seller?.email}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`ps-type-badge ${property.type}`}>
                          {getTypeLabel(property.type)}
                        </span>
                      </td>
                      <td className="ps-price">
                        {formatCurrency(property.priceAsked)}
                      </td>
                      <td>
                        <span className={`ps-status-pill ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="ps-manage-btn"
                          onClick={() => navigate(`/property-selling/${property._id}`)}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="ps-empty">No properties found matching your search.</td>
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

export default PropertySelling;