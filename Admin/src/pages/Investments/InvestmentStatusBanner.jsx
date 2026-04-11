import React, { useMemo } from "react";
import "./InvestmentStatusBanner.css";

const InvestmentStatusBanner = ({ investment, onUpdate }) => {
  const { st, meta, message, label } = useMemo(() => {
    const statusRaw = investment?.status || "unknown";
    const st = String(statusRaw).toLowerCase();

    const STATUS_META = {
      pending: {
        icon: "fa-hourglass-half",
        tone: "warn",
      },
      confirmed: {
        icon: "fa-circle-check",
        tone: "success",
      },
      completed: {
        icon: "fa-circle-check",
        tone: "info",
      },
      cancelled: {
        icon: "fa-circle-xmark",
        tone: "danger",
      },
      unknown: {
        icon: "fa-circle-question",
        tone: "neutral",
      },
    };

    const meta = STATUS_META[st] || STATUS_META.unknown;

    const message =
      st === "pending"
        ? "This investment is pending verification."
        : st === "confirmed"
        ? "This investment has been confirmed."
        : st === "completed"
        ? "This investment is completed successfully."
        : st === "cancelled"
        ? investment?.cancelReason
          ? `Cancelled: ${investment.cancelReason}`
          : "This investment was cancelled."
        : "Status is unknown.";

    return {
      st,
      meta,
      message,
      label: statusRaw,
    };
  }, [investment]);

  const hideUpdate = st === "confirmed";

  return (
    <div className={`isb-container ${meta.tone}`}>
      <div className="isb-left">
        <div className="isb-icon">
          <i className={`fa-solid ${meta.icon}`}></i>
        </div>

        <div className="isb-content">
          <div className="isb-title">
            Investment Status:
            <span className={`isb-status ${meta.tone}`}>
              {label}
            </span>
          </div>

          <div className="isb-sub">{message}</div>
        </div>
      </div>

      {!hideUpdate && (
        <button
          className="btn btn-primary isb-btn"
          onClick={onUpdate}
        >
          <i className="fa-solid fa-pen"></i>
          <span>Update Status</span>
        </button>
      )}
    </div>
  );
};

export default InvestmentStatusBanner;