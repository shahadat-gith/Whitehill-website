import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PropertyDetails.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/utility";

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pricing States
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  const navigate = useNavigate();

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/property-selling/all");
      if (data?.success) {
        const found = data.data.find(prop => prop._id === propertyId);
        if (found) {
          setProperty(found);
          setCostPrice(found.costPrice || 0);
          setSellingPrice(found.sellingPrice || 0);
        }
      }
    } catch (error) {
      toast.error("Error loading property");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const handleUpdatePrices = async () => {
    try {
      const { data } = await api.post("/api/admin/property-selling/update-prices", {
        id: property._id,
        costPrice,
        sellingPrice
      });
      if (data?.success) toast.success("Prices updated");
    } catch (error) {
      toast.error("Failed to update prices");
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      const { data } = await api.post("/api/admin/property-selling/update-status", { id: property._id, status });
      if (data?.success) {
        toast.success(`Property ${status}`);
        setProperty(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="pd-container">Loading...</div>;
  if (!property) return <div className="pd-container">Not Found</div>;

  const details = property.type === 'land' ? property.landDetails : property.propertyDetails;

  return (
    <div className="pd-container">
      <div className="pd-header">
        <button className="pd-back-btn" onClick={() => navigate("/property-selling")}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <h1>{property.type.toUpperCase()} Management</h1>
      </div>

      <div className="pd-layout">
        <div className="pd-main">
          {/* IMAGE GALLERY */}
          <div className="pd-card gallery-card">
            <h3 className="pd-section-title">Visuals</h3>
            <div className="pd-image-grid">
              {details?.images?.map((img, i) => (
                <img key={i} src={img.url} alt="Property" className="pd-main-img" />
              ))}
            </div>
          </div>

          {/* SPECIFIC DETAILS */}
          <div className="pd-card">
            <div className="pd-card-header">
               <h2>{property.type === 'land' ? 'Land Specifications' : 'Building Details'}</h2>
               <span className={`pd-status-pill status-${property.status}`}>{property.status}</span>
            </div>

            <div className="pd-grid">
              {property.type === 'land' ? (
                <>
                  <div className="pd-item"><label>Area</label><span>{details.area.bigha} Bigha, {details.area.kattha} Kattha, {details.area.lessa} Lessa</span></div>
                  <div className="pd-item"><label>Dag No.</label><span>{details.dagNumber}</span></div>
                  <div className="pd-item"><label>Patta No.</label><span>{details.pattaNumber}</span></div>
                  <div className="pd-item"><label>Land Type</label><span className="pd-tag">{details.landType}</span></div>
                </>
              ) : (
                <>
                  <div className="pd-item"><label>Bedrooms</label><span>{details.bedrooms} BHK</span></div>
                  <div className="pd-item"><label>Bathrooms</label><span>{details.bathrooms}</span></div>
                  <div className="pd-item"><label>Parking</label><span>{details.parkingSpaces} Spaces</span></div>
                </>
              )}
            </div>

            <div className="pd-divider"></div>

            <h3 className="pd-section-title">Location (Geo-Data)</h3>
            <div className="pd-grid">
              <div className="pd-item"><label>Village/Area</label><span>{property.location.village}</span></div>
              <div className="pd-item"><label>Mouza</label><span>{property.location.mouza}</span></div>
              <div className="pd-item"><label>District</label><span>{property.location.district}</span></div>
              <div className="pd-item"><label>Pincode</label><span>{property.location.pincode}</span></div>
            </div>

            <div className="pd-divider"></div>
            
            <h3 className="pd-section-title">Documents</h3>
            <div className="pd-doc-row">
               {details.documents && Object.entries(details.documents).map(([key, doc]) => (
                 doc.url && (
                  <a key={key} href={doc.url} target="_blank" className="pd-doc-btn">
                    <i className="fas fa-file-contract"></i> {key.replace(/([A-Z])/g, ' $1')}
                  </a>
                 )
               ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR FOR PRICE MGMT & ACTIONS */}
        <div className="pd-sidebar">
          <div className="pd-card admin-card">
            <h3>Pricing Management</h3>
            <div className="pd-field">
              <label>Asked by Seller</label>
              <div className="pd-val-asked">{formatCurrency(property.priceAsked)}</div>
            </div>
            
            <div className="pd-field">
              <label>Admin Cost Price (₹)</label>
              <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="pd-input" />
            </div>

            <div className="pd-field">
              <label>Final Selling Price (₹)</label>
              <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="pd-input" />
            </div>

            <button className="pd-btn-save" onClick={handleUpdatePrices}>Update Pricing</button>
          </div>

          <div className="pd-card action-card">
            <h3>Approval Flow</h3>
            <div className="pd-btn-group">
              <button className="pd-btn-approve" onClick={() => handleStatusUpdate('approved')}>Approve Listing</button>
              <button className="pd-btn-reject" onClick={() => handleStatusUpdate('rejected')}>Reject Listing</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;