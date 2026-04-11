import { useEffect } from "react";
import "./ImageViewerModal.css";

const ImageViewerModal = ({ url, title, isOpen, onClose }) => {
  if (!isOpen) return null;

  /* ESC close */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const stop = (e) => e.stopPropagation();

  return (
    <div className="iv-overlay" onClick={onClose}>
      <div className="iv-modal" onClick={stop}>

        {/* HEADER */}
        <div className="iv-header">
          <h4 className="iv-title">
            <i className="fa-solid fa-image"></i>
            <span>{title} Preview</span>
          </h4>

          <button className="iv-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="iv-body">
          {url ? (
            <div className="iv-img-wrap">
              <img src={url} alt="Preview" className="iv-img" />
            </div>
          ) : (
            <div className="iv-empty">No image available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;