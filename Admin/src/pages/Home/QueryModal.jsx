import React, { useEffect, useMemo, useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";

const QueryModal = ({ isOpen, onClose, query }) => {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const q = useMemo(() => query || {}, [query]);
  const hasReply = Boolean(String(q?.reply || "").trim());

  useEffect(() => {
    // reset reply when modal opens / query changes
    if (isOpen) setReply(String(q?.reply || ""));
  }, [isOpen, q?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = reply.trim();
    if (!text) return toast.error("Please write a reply");

    try {
      setSubmitting(true);

      // ✅ change endpoint if yours is different
      const { data } = await api.put("/api/admin/query/reply", {
        queryId: q._id,
        reply: text,
      });

      if (data?.success) {
        toast.success("Reply sent");
        onClose(true); // refresh dashboard
      } else {
        toast.error(data?.message || "Failed to send reply");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send reply");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 9999,
    },
    dialog: {
      width: "min(720px, 100%)",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: 16,
      boxShadow: "var(--shadow-md)",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "14px 16px",
      background: "var(--bg-muted)",
      borderBottom: "1px solid var(--border-color)",
    },
    title: { margin: 0, fontSize: 16, fontWeight: 800, color: "var(--text-primary)" },
    close: {
      width: 34,
      height: 34,
      borderRadius: 999,
      border: "1px solid var(--border-color)",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
    },
    body: { padding: 16, color: "var(--text-primary)" },

    label: { fontSize: 12, color: "var(--text-muted)", marginBottom: 6 },
    value: { fontSize: 14, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis" },
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontWeight: 700 },
    messageBox: {
      padding: 14,
      borderRadius: 12,
      background: "var(--bg-main)",
      border: "1px solid var(--border-color)",
      marginBottom: 14,
      lineHeight: 1.5,
      whiteSpace: "pre-wrap",
    },
    form: { display: "grid", gap: 10 },
    textarea: {
      width: "100%",
      borderRadius: 12,
      border: "1px solid var(--border-color)",
      background: "var(--bg-main)",
      color: "var(--text-primary)",
      padding: 12,
      minHeight: 110,
      resize: "vertical",
      outline: "none",
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      padding: "14px 16px",
      borderTop: "1px solid var(--border-color)",
      background: "var(--bg-muted)",
    },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid var(--border-color)",
      cursor: "pointer",
      fontWeight: 700,
      background: "var(--bg-card)",
      color: "var(--text-primary)",
    },
    primary: {
      borderColor: "rgba(20,83,45,0.35)",
      background: "var(--color-primary)",
      color: "var(--text-inverse)",
    },
    disabled: { opacity: 0.7, cursor: "not-allowed" },
  };

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Query details">
      <div style={styles.dialog}>
        <div style={styles.header}>
          <h3 style={styles.title}>{query.name}'s query</h3>
          <button type="button" style={styles.close} onClick={() => onClose(false)} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.label}>Message</div>
          <div style={styles.messageBox}>{q?.message || "-"}</div>

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.label}>Reply</div>
            <textarea
              style={styles.textarea}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply here..."
              disabled={submitting}
            />

            {hasReply && (
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Note: This query already has a reply. Updating will overwrite it.
              </div>
            )}

            <div style={styles.footer}>
              <button
                type="button"
                style={{ ...styles.btn }}
                onClick={() => onClose(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  ...styles.btn,
                  ...styles.primary,
                  ...(submitting ? styles.disabled : {}),
                }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;
