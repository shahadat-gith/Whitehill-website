import "./FundRequests.css"
import { formatCurrency, getStatusColor } from "../../../../Utils/utility";

const FundRequests = ({ fundRequests }) => {
    return (
        <div className="fr-container">
            <div className="fr-header-flex">
                <h3>Fund Requests</h3>
                <span className="fr-count">{fundRequests.length} Total</span>
            </div>

            {fundRequests.length === 0 ? (
                <div className="fr-empty">
                    <i className="fas fa-hand-holding-usd"></i>
                    <p>No fund requests found.</p>
                </div>
            ) : (
                <div className="fr-list">
                    {fundRequests.map((request) => (
                        <div key={request._id} className="fr-row">
                            <div className="fr-col fr-main">
                                <div className="fr-icon-box">
                                    <i className={request.type === 'startup' ? 'fas fa-rocket' : 'fas fa-briefcase'}></i>
                                </div>
                                <div>
                                    <p className="fr-name">{request.name}</p>
                                    <p className="fr-type">{request.type === 'startup' ? 'Startup' : 'Business Venture'}</p>
                                </div>
                            </div>

                            <div className="fr-col">
                                <p className="fr-label">Amount Requested</p>
                                <p className="fr-amount">{formatCurrency(request.amountRequested)}</p>
                            </div>

                            <div className="fr-col">
                                <p className="fr-label">Amount Allocated</p>
                                <p className="fr-amount fr-allocated">
                                    {request.amountAlloted > 0 ? formatCurrency(request.amountAlloted) : "Pending"}
                                </p>
                            </div>

                            <div className="fr-col fr-status-col">
                                <p className="fr-label">Status</p>
                                <span className={`prf-badge ${getStatusColor(request.status)}`}>
                                    {request.status}
                                </span>
                            </div>

                            <div className="fr-date">
                                {new Date(request.createdAt).toLocaleDateString('en-IN', {
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

export default FundRequests;