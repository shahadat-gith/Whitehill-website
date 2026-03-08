import "./PropertySelling.css"
import { formatCurrency, getStatusColor } from "../../../../Utils/utility";

const PropertySelling = ({ propertySellings }) => {
    return (
        <div className="ps-container">
            <div className="ps-header-flex">
                <h3>Property Selling Requests</h3>
                <span className="ps-count">{propertySellings.length} Total</span>
            </div>

            {propertySellings.length === 0 ? (
                <div className="ps-empty">
                    <i className="fas fa-home"></i>
                    <p>No property selling requests found.</p>
                </div>
            ) : (
                <div className="ps-list">
                    {propertySellings.map((property) => (
                        <div key={property._id} className="ps-row">
                            <div className="ps-col ps-main">
                                <div className="ps-icon-box">
                                    <i className={property.type === 'land' ? 'fas fa-map' : 'fas fa-building'}></i>
                                </div>
                                <div>
                                    <p className="ps-label">Asking Price</p>
                                    <p className="ps-amount">{formatCurrency(property.priceAsked)}</p>
                                </div>
                            </div>

                            <div className="ps-col">
                                <p className="ps-label">Category</p>
                                <p className="ps-type">{property.type}</p>
                            </div>

                            <div className="ps-col ps-status-col">
                                <p className="ps-label">Request Status</p>
                                <span className={`prf-badge ${getStatusColor(property.status)}`}>
                                    {property.status}
                                </span>
                            </div>

                            <div className="ps-date">
                                {new Date(property.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertySelling;