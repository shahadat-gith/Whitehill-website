import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserDetails.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import KycVerifyModal from "./KycVerifyModal";
import ImageViewerModal from "./ImageViewerModal";

const UserDetails = () => {
    const { userId } = useParams();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showKycModal, setShowKycModal] = useState(false);

    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerUrl, setViewerUrl] = useState("");
    const [viewDocTitle, setViewDocTitle] = useState("")

    const openViewer = (url, title) => {
        if (!url) return;
        setViewerUrl(url);
        setViewerOpen(true);
        setViewDocTitle(title)
    };

    const closeViewer = () => {
        setViewerOpen(false);
        setViewerUrl("");
        setViewDocTitle("")
    };

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.post("/api/admin/user/single", { userId });

            if (data?.success) {
                setUser(data.user);
            } else {
                toast.error(data?.message || "Failed to load user");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) fetchUser();
    }, [userId, fetchUser]);

    const view = useMemo(() => {
        const u = user || {};
        const kyc = u.kyc || {};
        const aadhar = kyc.aadhar || {};
        const pan = kyc.pan || {};
        const kycStatus = String(kyc.status || "pending").toLowerCase();

        const tone =
            kycStatus === "verified"
                ? "ok"
                : kycStatus === "rejected"
                    ? "danger"
                    : "warn";

        const icon =
            kycStatus === "verified"
                ? "fa-circle-check"
                : kycStatus === "rejected"
                    ? "fa-circle-xmark"
                    : "fa-hourglass-half";

        const message =
            kycStatus === "pending"
                ? "KYC is pending review."
                : kycStatus === "verified"
                    ? "KYC has been verified."
                    : kycStatus === "rejected"
                        ? kyc.rejectionReason
                            ? `KYC rejected. Reason: ${kyc.rejectionReason}`
                            : "KYC rejected."
                        : "KYC status unknown.";

        return { u, kyc, aadhar, pan, kycStatus, tone, icon, message };
    }, [user]);

    if (loading) {
        return (
            <div className="ud-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Loading user details...</span>
            </div>
        );
    }

    if (!view.u?._id) return null;

    const { u, kyc, aadhar, pan, tone, icon, message } = view;

    return (
        <div className="ud-container">
            {/* Header */}
            <div className="ud-header">
                <div className="ud-userhead">
                    <img
                        className="ud-avatar"
                        src={u?.image?.url || "/user.png"}
                        alt={u.fullName || "User"}
                        style={{ cursor: "pointer" }}
                        title="Click to view image"
                        onClick={() => openViewer(u?.image?.url || "/user.png", `${u.fullName} Image`)}
                    />
                    <div>
                        <h2 className="ud-title">{u.fullName || "User"}</h2>
                        <div className="ud-sub">
                            <span>{u.email || "-"}</span>
                            {u.phone ? <span>• {u.phone}</span> : null}
                        </div>
                        <div className="ud-mono">
                            User ID: <span>{u._id}</span>
                        </div>
                    </div>
                </div>

                <div className="ud-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchUser}
                        disabled={loading}
                    >
                        <i className="fa-solid fa-rotate"></i>
                        <span>Refresh</span>
                    </button>

                    {!(kyc.status === "verified") &&

                        <button
                            className="btn btn-primary"
                            onClick={() => setShowKycModal(true)}
                        >
                            <i className="fa-solid fa-shield-halved"></i>
                            <span>Verify KYC</span>
                        </button>

                    }
                </div>
            </div>

            {/* KYC Banner */}
            <div className={`ud-kyc-banner ${tone}`}>
                <div className="ud-kyc-left">
                    <div className={`ud-kyc-icon ${tone}`}>
                        <i className={`fa-solid ${icon}`}></i>
                    </div>

                    <div className="ud-kyc-content">
                        <div className="ud-kyc-title">
                            KYC Status:{" "}
                            <span className={`ud-pill ${tone}`}>
                                {String(kyc?.status || "pending").toUpperCase()}
                            </span>
                        </div>
                        <div className="ud-kyc-sub">{message}</div>

                        {kyc?.verifiedAt ? (
                            <div className="ud-kyc-meta">
                                Verified at: {new Date(kyc.verifiedAt).toLocaleString("en-IN")}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Content grid */}
            <div className="ud-grid">
                {/* Portfolio */}
                <div className="ud-card">
                    <div className="ud-card-title">
                        <i className="fa-solid fa-chart-line"></i>
                        <span>Portfolio Summary</span>
                    </div>

                    <div className="ud-row">
                        <span className="ud-label">Total Invested</span>
                        <span className="ud-value ud-strong">
                            ₹{Number(u.totalInvested || 0).toLocaleString("en-IN")}
                        </span>
                    </div>

                    <div className="ud-row">
                        <span className="ud-label">Portfolio Value</span>
                        <span className="ud-value">
                            ₹{Number(u.portfolioValue || 0).toLocaleString("en-IN")}
                        </span>
                    </div>

                    <div className="ud-row">
                        <span className="ud-label">Total Distributions</span>
                        <span className="ud-value">
                            ₹{Number(u.totalDistributions || 0).toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                {/* Aadhar */}
                <div className="ud-card">
                    <div className="ud-card-title">
                        <i className="fa-solid fa-id-card"></i>
                        <span>Aadhar</span>
                    </div>

                    <div className="ud-row">
                        <span className="ud-label">Aadhar Number</span>
                        <span className="ud-value ud-mono">
                            {aadhar.aadharNumber || "N/A"}
                        </span>
                    </div>

                    <div className="ud-docs">
                        {aadhar?.frontImageUrl?.url ? (
                            <button
                                type="button"
                                className="ud-doc ud-doc-btn"
                                onClick={() => openViewer(aadhar.frontImageUrl.url, "Aadhar Front Image")}
                                title="View Aadhar Front"
                            >
                                <img src={aadhar.frontImageUrl.url} alt="Aadhar Front" />
                                <div className="ud-doc-cap">Front</div>
                            </button>
                        ) : (
                            <div className="ud-doc ud-doc-empty">Front not uploaded</div>
                        )}

                        {aadhar?.backImageUrl?.url ? (
                            <button
                                type="button"
                                className="ud-doc ud-doc-btn"
                                onClick={() => openViewer(aadhar.backImageUrl.url, "Aadhar Back image")}
                                title="View Aadhar Back"
                            >
                                <img src={aadhar.backImageUrl.url} alt="Aadhar Back" />
                                <div className="ud-doc-cap">Back</div>
                            </button>
                        ) : (
                            <div className="ud-doc ud-doc-empty">Back not uploaded</div>
                        )}
                    </div>
                </div>

                {/* PAN */}
                <div className="ud-card">
                    <div className="ud-card-title">
                        <i className="fa-solid fa-id-badge"></i>
                        <span>PAN</span>
                    </div>

                    <div className="ud-row">
                        <span className="ud-label">PAN Number</span>
                        <span className="ud-value ud-mono">{pan.panNumber || "N/A"}</span>
                    </div>

                    <div className="ud-docs">
                        {pan?.frontImageUrl?.url ? (
                            <button
                                type="button"
                                className="ud-doc ud-doc-btn"
                                onClick={() => openViewer(pan.frontImageUrl.url, "Pan Front Image")}
                                title="View PAN"
                            >
                                <img src={pan.frontImageUrl.url} alt="PAN Front" />
                                <div className="ud-doc-cap">Front</div>
                            </button>
                        ) : (
                            <div className="ud-doc ud-doc-empty">Front not uploaded</div>
                        )}
                    </div>
                </div>

                {/* Bank Details */}
                <div className="ud-card ud-span-3">
                    <div className="ud-card-title">
                        <i className="fa-solid fa-building-columns"></i>
                        <span>Bank Details</span>
                    </div>

                    {u.bankDetails ? (
                        <div className="ud-bank-grid">
                            <div className="ud-row">
                                <span className="ud-label">Account Holder</span>
                                <span className="ud-value">
                                    {u.bankDetails.accountHolderName || "N/A"}
                                </span>
                            </div>
                            <div className="ud-row">
                                <span className="ud-label">Account Number</span>
                                <span className="ud-value ud-mono">
                                    {u.bankDetails.accountNumber || "N/A"}
                                </span>
                            </div>
                            <div className="ud-row">
                                <span className="ud-label">IFSC</span>
                                <span className="ud-value ud-mono">
                                    {u.bankDetails.ifsc || "N/A"}
                                </span>
                            </div>
                            <div className="ud-row">
                                <span className="ud-label">Bank</span>
                                <span className="ud-value">
                                    {u.bankDetails.bankName || "N/A"}
                                </span>
                            </div>
                            <div className="ud-row">
                                <span className="ud-label">Branch</span>
                                <span className="ud-value">
                                    {u.bankDetails.branch || "N/A"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="ud-empty">
                            <i className="fa-solid fa-circle-info"></i>
                            <span>No bank details submitted</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ KYC Modal */}
            <KycVerifyModal
                isOpen={showKycModal}
                onClose={(refresh) => {
                    setShowKycModal(false);
                    if (refresh) fetchUser();
                }}
                userId={u._id}
                email={u.email}
                currentStatus={kyc?.status}
            />

            {/* ✅ Image Viewer Modal */}
            <ImageViewerModal
                isOpen={viewerOpen}
                url={viewerUrl}
                title={viewDocTitle}
                onClose={closeViewer} />
        </div>
    );
};

export default UserDetails;
