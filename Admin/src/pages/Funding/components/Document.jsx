import React from "react";
import "./Document.css";

const Document = ({ doc }) => {
  if (!doc) return null;

  return (
    <div className="dm-document-item">
      {/* LEFT SECTION: Icon & Info */}
      <div className="dm-doc-left">
        <div className="dm-doc-icon">
          <i className="fa-solid fa-file-pdf"></i>
        </div>

        <div className="dm-doc-info">
          <div className="dm-doc-name">{doc.label}</div>
          <div className="dm-doc-size">(Click to view)</div>
        </div>
      </div>

      {/* RIGHT SECTION: Managed Actions */}
      <div className="dm-doc-actions">
        {/* VIEW LINK */}
        <a
          href={doc.value?.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          title="View Document"
        >
          <i className="fa-solid fa-eye"></i>
        </a>

        {/* APPROVE ACTION */}
        <button className="dm-doc-approve" title="Approve">
          <i className="fa-solid fa-check"></i>
        </button>

        {/* REJECT ACTION */}
        <button className="dm-doc-reject" title="Reject">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default Document;