import React, { useMemo } from "react";

const InvestmentStatusBanner = ({ investment, onUpdate }) => {
    const { st, meta, message, label, toneBg } = useMemo(() => {
        const statusRaw = investment?.status || "unknown";
        const st = String(statusRaw).toLowerCase();

        // ✅ per-status icon + color
        const STATUS_META = {
            pending: {
                icon: "fa-hourglass-half",
                fg: "var(--color-warning)",
                bg: "rgba(180, 83, 9, 0.14)",
                border: "rgba(180, 83, 9, 0.35)",
                tint: "rgba(180, 83, 9, 0.10)",
            },
            confirmed: {
                icon: "fa-circle-check",
                fg: "var(--color-success)",
                bg: "rgba(22, 101, 52, 0.14)",
                border: "rgba(22, 101, 52, 0.35)",
                tint: "rgba(22, 101, 52, 0.08)",
            },
            completed: {
                icon: "fa-circle-check", 
                fg: "var(--color-info)",
                bg: "rgba(6, 95, 70, 0.14)",
                border: "rgba(6, 95, 70, 0.35)",
                tint: "rgba(6, 95, 70, 0.08)",
            },
            cancelled: {
                icon: "fa-circle-xmark",
                fg: "var(--color-danger)",
                bg: "rgba(153, 27, 27, 0.14)",
                border: "rgba(153, 27, 27, 0.35)",
                tint: "rgba(153, 27, 27, 0.10)",
            },
            unknown: {
                icon: "fa-circle-question",
                fg: "var(--text-secondary)",
                bg: "rgba(100, 116, 139, 0.14)",
                border: "rgba(100, 116, 139, 0.35)",
                tint: "rgba(100, 116, 139, 0.08)",
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
                                ? `This investment was cancelled. Reason: ${investment.cancelReason}`
                                : "This investment was cancelled."
                            : "Status is unknown.";

        const toneBg = {
            borderColor: meta.border,
            background: `linear-gradient(0deg, ${meta.tint}, ${meta.tint})`,
        };

        return {
            st,
            meta,
            message,
            label: statusRaw,
            toneBg,
        };
    }, [investment]);

    const styles = {
        wrap: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "16px 18px",
            borderRadius: 14,
            marginBottom: 24,
            border: "1px solid var(--border-color)",
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-sm)",
        },
        left: {
            display: "flex",
            alignItems: "center",
            gap: 16,
            flex: 1,
            minWidth: 0,
        },
        iconBox: {
            width: 40,
            height: 40,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            fontSize: 20,
            background: meta.bg,
            color: meta.fg,
        },
        content: {
            flex: 1,
            minWidth: 0,
        },
        title: {
            fontWeight: 750,
            fontSize: 15,
            color: "var(--text-primary)",
            marginBottom: 4,
            lineHeight: 1.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
        status: {
            fontWeight: 800,
            textTransform: "capitalize",
            color: meta.fg,
        },
        sub: {
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.35,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
        },
        btn: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            flexShrink: 0,
        },
    };

    // ✅ hide Update button when completed
    const hideUpdate = st === "completed";
    return (
        <div className={`id-verify status-${st}`} style={{ ...styles.wrap, ...toneBg }}>
            <div style={styles.left}>
                <div style={styles.iconBox}>
                    <i className={`fa-solid ${meta.icon}`}></i>
                </div>

                <div className="id-verify-content" style={styles.content}>
                    <div className="id-verify-title" style={styles.title}>
                        Investment Status:{" "}
                        <span className={`id-status ${st}`} style={styles.status}>
                            {label}
                        </span>
                    </div>

                    <div className="id-verify-sub" style={styles.sub}>
                        {message}
                    </div>
                </div>
            </div>

            {!hideUpdate && (
                <button
                    type="button"
                    className="btn btn-primary id-verify-btn"
                    style={styles.btn}
                    onClick={onUpdate}
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Update Status</span>
                </button>

            )}
        </div>
    );
};

export default InvestmentStatusBanner;
