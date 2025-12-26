import React from "react";
import { Document, Page, pdfjs } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PdfPreview = ({ url }) => {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Document
        file={url}
        loading="Loading PDF..."
        error="Failed to load PDF document."
      >
        {/* First page is enough for KYC */}
        <Page pageNumber={1} width={800} />
      </Document>
    </div>
  );
};

export default PdfPreview;
