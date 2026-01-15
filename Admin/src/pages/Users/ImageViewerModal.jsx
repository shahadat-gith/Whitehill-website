
const ImageViewerModal = ({ url, title, isOpen, onClose }) => {

  if (!isOpen) return null;
  const stop = (e) => e.stopPropagation();

  return (
    <div style={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div style={styles.modal} onClick={stop}>
        <div style={styles.header}>
          <h4 style={styles.title}>
            <i className="fa-solid fa-image" />
            <span style={styles.titleText}>{title} Preview</span>
          </h4>

          <button
            type="button"
            style={styles.closeBtn}
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.imgWrap}>
            {url ? (
              <img src={url} alt="Preview" style={styles.img} loading="lazy" />
            ) : (
              <div style={{ padding: 24, color: "var(--text-muted)" }}>
                No image url provided
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;


 const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.72)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    modal: {
      width: "min(900px, 96vw)",
      maxHeight: "90vh",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: 16,
      boxShadow: "var(--shadow-md)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "12px 14px",
      background: "var(--bg-muted)",
      borderBottom: "1px solid var(--border-color)",
    },
    title: {
      margin: 0,
      fontSize: 14,
      fontWeight: 800,
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      minWidth: 0,
    },
    titleText: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 10,
      border: "1px solid var(--border-color)",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      transition: "transform 0.12s ease, background 0.12s ease",
    },
    body: {
      padding: 12,
      background: "var(--bg-card)",
      overflow: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    imgWrap: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-main)",
      border: "1px solid var(--border-color)",
      borderRadius: 14,
      overflow: "hidden",
    },
    img: {
      width: "100%",
      height: "auto",
      maxHeight: "78vh",
      objectFit: "contain",
      display: "block",
      userSelect: "none",
    },
  };

