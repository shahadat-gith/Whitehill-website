import React, { useState } from "react";
import { formatDate } from "../../../../Utils/utility";
import BankModal from "../../Modals/BankModal/BankModal";
import "./Bank.css";

const Bank = ({ user }) => {
  const bank = user?.bankDetails;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bn-container">
      {/* ================= HEADER ================= */}
      <div className="bn-header">
        <div className="bn-header-left">
          <h2 className="bn-title">Bank Account Details</h2>
          <p className="bn-subtitle">Manage your payout and settlement destination</p>
        </div>
        
        <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
          <i className="fas fa-university"></i>
          {bank ? "Update Account" : "Link Bank Account"}
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      {bank ? (
        <div className="bn-grid">
          <div className="bn-card">
            <label className="bn-label">Account Holder</label>
            <p className="bn-value">{bank.accountHolderName}</p>
          </div>

          <div className="bn-card">
            <label className="bn-label">Account Number</label>
            <p className="bn-value">
              <span className="bn-mask">•••• ••••</span> {bank.accountNumber?.slice(-4)}
            </p>
          </div>

          <div className="bn-card">
            <label className="bn-label">IFSC Identifier</label>
            <p className="bn-value">{bank.ifsc}</p>
          </div>

          <div className="bn-card">
            <label className="bn-label">Financial Institution</label>
            <p className="bn-value">{bank.bankName}</p>
          </div>

          <div className="bn-card bn-full">
            <label className="bn-label">Branch Location</label>
            <p className="bn-value">{bank.branch}</p>
          </div>
        </div>
      ) : (
        <div className="bn-empty">
          <div className="bn-empty-icon">
            <i className="fas fa-building-columns"></i>
          </div>
          <h3>No Bank Account Linked</h3>
          <p>Link your primary bank account to receive returns and manage your capital.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Connect Account
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <BankModal
          onClose={() => setShowModal(false)}
          bank={bank}
        />
      )}
    </div>
  );
};

export default Bank;