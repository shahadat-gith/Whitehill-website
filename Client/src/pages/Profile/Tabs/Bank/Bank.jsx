import React, { useState } from "react";
import { formatDate } from "../../utility";
import BankModal from "../../Modals/BankModal/BankModal";
import "./Bank.css"

const Bank = ({ user }) => {
  const bank = user?.bankDetails;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="prf-tab-content">
      {/* ================= HEADER ================= */}
      <div className="prf-section-header">
        <h2>Bank Account Details</h2>
        <button
          className="prf-btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-university"></i>{" "}
          {bank ? "Update Bank Details" : "Add Bank Details"}
        </button>
      </div>

      {/* ================= BANK DETAILS ================= */}
      {bank ? (
        <div className="prf-bank-info">
          <div className="prf-info-card">
            <div className="prf-info-label">Account Holder Name</div>
            <div className="prf-info-value">{bank.accountHolderName}</div>
          </div>

          <div className="prf-info-card">
            <div className="prf-info-label">Account Number</div>
            <div className="prf-info-value">
              ••••••{bank.accountNumber?.slice(-4)}
            </div>
          </div>

          <div className="prf-info-card">
            <div className="prf-info-label">IFSC Code</div>
            <div className="prf-info-value">{bank.ifsc}</div>
          </div>

          <div className="prf-info-card">
            <div className="prf-info-label">Bank Name</div>
            <div className="prf-info-value">{bank.bankName}</div>
          </div>

          <div className="prf-info-card prf-full-width">
            <div className="prf-info-label">Branch</div>
            <div className="prf-info-value">{bank.branch}</div>
          </div>
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="prf-empty-state">
          <p>You have not added your bank details yet.</p>
        </div>
      )}

      {/* ================= PAYOUT INFO ================= */}
      {user?.nextPayoutDate && (
        <div className="prf-payout-info">
          <h3>Payout Information</h3>
          <div className="prf-payout-card">
            <p>Next payout scheduled for</p>
            <p className="prf-payout-date">
              <i className="fas fa-calendar-alt"></i>{" "}
              {formatDate(user.nextPayoutDate)}
            </p>
          </div>
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
