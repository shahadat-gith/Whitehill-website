import React, { useState } from "react";
import { formatDate } from "../../../../Utils/utility";
import BankModal from "../../Modals/BankModal/BankModal";
import "./Bank.css";

const Bank = ({ user }) => {
  const bank = user?.bankDetails;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bn-tab-content">
      {/* ================= HEADER ================= */}
      <div className="bn-section-header">
        <h2>Bank Account Details</h2>
        <button
          className="bn-btn-update"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-university"></i>{" "}
          {bank ? "Update Bank Details" : "Add Bank Details"}
        </button>
      </div>

      {/* ================= BANK DETAILS ================= */}
      {bank ? (
        <div className="bn-bank-info">
          <div className="bn-info-card">
            <div className="bn-info-label">Account Holder Name</div>
            <div className="bn-info-value">{bank.accountHolderName}</div>
          </div>

          <div className="bn-info-card">
            <div className="bn-info-label">Account Number</div>
            <div className="bn-info-value">
              ••••••{bank.accountNumber?.slice(-4)}
            </div>
          </div>

          <div className="bn-info-card">
            <div className="bn-info-label">IFSC Code</div>
            <div className="bn-info-value">{bank.ifsc}</div>
          </div>

          <div className="bn-info-card">
            <div className="bn-info-label">Bank Name</div>
            <div className="bn-info-value">{bank.bankName}</div>
          </div>

          <div className="bn-info-card bn-full-width">
            <div className="bn-info-label">Branch</div>
            <div className="bn-info-value">{bank.branch}</div>
          </div>
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="bn-empty-state">
          <p>You have not added your bank details yet.</p>
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
