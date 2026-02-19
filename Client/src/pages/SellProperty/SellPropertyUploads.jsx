import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../Configs/axios";
import "./Styles/Layout.css";
import "./Styles/SellProperty.css";

const SellPropertyUploads = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type") === "property" ? "property" : "land";
  const isLand = type === "land";

  const [documents, setDocuments] = useState({
    landOwnershipProof: null,
    khajnaReceipt: null,
    ownershipProof: null,
    buildingPlan: null,
  });

  const [media, setMedia] = useState({
    landImages: [],
    propertyImages: [],
    outsideView: null,
    insideView: null,
  });

  const [uploadDone, setUploadDone] = useState({
    documents: false,
    images: false,
    videos: isLand,
  });

  const [uploading, setUploading] = useState({
    documents: false,
    images: false,
    videos: false,
  });

  const [progress, setProgress] = useState({
    documents: 0,
    images: 0,
    videos: 0,
  });

  const progressTimersRef = useRef({
    documents: null,
    images: null,
    videos: null,
  });

  const isComplete = uploadDone.documents && uploadDone.images && (isLand ? true : uploadDone.videos);

  const checklist = useMemo(
    () => [
      { key: "documents", label: "Documents uploaded" },
      { key: "images", label: "Images uploaded" },
      { key: "videos", label: isLand ? "Videos not required for land" : "Videos uploaded" },
    ],
    [isLand]
  );

  const clearProgressTimer = (key) => {
    if (progressTimersRef.current[key]) {
      clearInterval(progressTimersRef.current[key]);
      progressTimersRef.current[key] = null;
    }
  };

  const animateProgressTo = (key, target) => {
    const safeTarget = Math.max(0, Math.min(100, target));
    clearProgressTimer(key);

    progressTimersRef.current[key] = setInterval(() => {
      let done = false;

      setProgress((prev) => {
        const current = prev[key];

        if (current >= safeTarget) {
          done = true;
          return prev;
        }

        const gap = safeTarget - current;
        const step = Math.max(1, Math.ceil(gap / 8));
        const next = Math.min(safeTarget, current + step);

        if (next >= safeTarget) {
          done = true;
        }

        return { ...prev, [key]: next };
      });

      if (done) {
        clearProgressTimer(key);
      }
    }, 60);
  };

  useEffect(() => {
    return () => {
      clearProgressTimer("documents");
      clearProgressTimer("images");
      clearProgressTimer("videos");
    };
  }, []);

  const updateProgress = (key) => (event) => {
    if (!event.total) return;
    const percent = Math.round((event.loaded * 100) / event.total);
    animateProgressTo(key, Math.min(percent, 95));
  };

  const uploadDocuments = async () => {
    if (!id) return toast.error("Invalid request id");

    const formData = new FormData();
    if (isLand) {
      if (documents.landOwnershipProof) formData.append("landOwnershipProof", documents.landOwnershipProof);
      if (documents.khajnaReceipt) formData.append("khajnaReceipt", documents.khajnaReceipt);
    } else {
      if (documents.ownershipProof) formData.append("ownershipProof", documents.ownershipProof);
      if (documents.buildingPlan) formData.append("buildingPlan", documents.buildingPlan);
    }

    if (![...formData.keys()].length) {
      return toast.error("Select at least one document");
    }

    try {
      setUploading((prev) => ({ ...prev, documents: true }));
      setProgress((prev) => ({ ...prev, documents: 0 }));

      const { data } = await api.post(`/api/property-selling/${id}/upload-documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: updateProgress("documents"),
      });

      if (!data.success) throw new Error(data.message || "Document upload failed");

      setUploadDone((prev) => ({ ...prev, documents: true }));
      animateProgressTo("documents", 100);
      toast.success("Documents uploaded successfully");
    } catch (error) {
      clearProgressTimer("documents");
      toast.error(error.response?.data?.message || error.message || "Document upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, documents: false }));
    }
  };

  const uploadImages = async () => {
    if (!id) return toast.error("Invalid request id");

    const formData = new FormData();
    if (isLand) {
      if (!media.landImages.length) return toast.error("Select land images");
      media.landImages.forEach((file) => formData.append("landImages", file));
    } else {
      if (!media.propertyImages.length) return toast.error("Select property images");
      media.propertyImages.forEach((file) => formData.append("propertyImages", file));
    }

    try {
      setUploading((prev) => ({ ...prev, images: true }));
      setProgress((prev) => ({ ...prev, images: 0 }));

      const { data } = await api.post(`/api/property-selling/${id}/upload-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: updateProgress("images"),
      });

      if (!data.success) throw new Error(data.message || "Image upload failed");

      setUploadDone((prev) => ({ ...prev, images: true }));
      animateProgressTo("images", 100);
      toast.success("Images uploaded successfully");
    } catch (error) {
      clearProgressTimer("images");
      toast.error(error.response?.data?.message || error.message || "Image upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, images: false }));
    }
  };

  const uploadVideos = async () => {
    if (isLand) return;
    if (!id) return toast.error("Invalid request id");

    const formData = new FormData();
    if (media.outsideView) formData.append("outsideView", media.outsideView);
    if (media.insideView) formData.append("insideView", media.insideView);

    if (![...formData.keys()].length) {
      return toast.error("Select at least one video");
    }

    try {
      setUploading((prev) => ({ ...prev, videos: true }));
      setProgress((prev) => ({ ...prev, videos: 0 }));

      const { data } = await api.post(`/api/property-selling/${id}/upload-videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: updateProgress("videos"),
      });

      if (!data.success) throw new Error(data.message || "Video upload failed");

      setUploadDone((prev) => ({ ...prev, videos: true }));
      animateProgressTo("videos", 100);
      toast.success("Videos uploaded successfully");
    } catch (error) {
      clearProgressTimer("videos");
      toast.error(error.response?.data?.message || error.message || "Video upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, videos: false }));
    }
  };

  return (
    <div className="sell-property-page">
      <div className="sell-property-layout-full">
        <div className="sell-property-column">
          <div className="sell-property-card">
            <h2>Upload Property Files</h2>
            <p className="sp-upload-subtitle">Upload documents, images and videos with progress tracking.</p>
          </div>

          <div className="ifr-container sp-container">
            <form className="ifr-form sp-form" onSubmit={(event) => event.preventDefault()}>
              <section className="sp-section">
                <div className="sp-upload-checklist">
                  {checklist.map((item) => {
                    const checked = item.key === "videos" && isLand ? true : uploadDone[item.key];
                    return (
                      <div key={item.key} className={`sp-check ${checked ? "done" : "pending"}`}>
                        <i className={`fas ${checked ? "fa-check-circle" : "fa-circle-notch"}`}></i>
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="sp-upload-grid">
                  <div className="sp-upload-card">
                    <h4>1) Upload Documents</h4>
                    <div className="sp-grid sp-grid-2">
                      {isLand ? (
                        <>
                          <div className="sp-field">
                            <label>Land Ownership Proof (PDF)</label>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(event) =>
                                setDocuments((prev) => ({ ...prev, landOwnershipProof: event.target.files?.[0] || null }))
                              }
                            />
                          </div>

                          <div className="sp-field">
                            <label>Khajna Receipt (PDF)</label>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(event) =>
                                setDocuments((prev) => ({ ...prev, khajnaReceipt: event.target.files?.[0] || null }))
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="sp-field">
                            <label>Ownership Proof (PDF)</label>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(event) =>
                                setDocuments((prev) => ({ ...prev, ownershipProof: event.target.files?.[0] || null }))
                              }
                            />
                          </div>

                          <div className="sp-field">
                            <label>Building Plan (PDF)</label>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(event) =>
                                setDocuments((prev) => ({ ...prev, buildingPlan: event.target.files?.[0] || null }))
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <button type="button" className="btn btn-primary" onClick={uploadDocuments} disabled={uploading.documents}>
                      Upload Documents
                    </button>
                    <div className="sp-video-progress-wrap">
                      <div className="sp-video-progress-track">
                        <div className="sp-video-progress-fill" style={{ width: `${progress.documents}%` }}></div>
                      </div>
                      <span className="sp-video-progress-label">{progress.documents}%</span>
                    </div>
                  </div>

                  <div className="sp-upload-card">
                    <h4>2) Upload Images</h4>
                    <div className="sp-field">
                      <label>{isLand ? "Land Images" : "Property Images"}</label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        multiple
                        onChange={(event) => {
                          const files = Array.from(event.target.files || []);
                          if (isLand) {
                            setMedia((prev) => ({ ...prev, landImages: files }));
                          } else {
                            setMedia((prev) => ({ ...prev, propertyImages: files }));
                          }
                        }}
                      />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={uploadImages} disabled={uploading.images}>
                      Upload Images
                    </button>
                    <div className="sp-video-progress-wrap">
                      <div className="sp-video-progress-track">
                        <div className="sp-video-progress-fill" style={{ width: `${progress.images}%` }}></div>
                      </div>
                      <span className="sp-video-progress-label">{progress.images}%</span>
                    </div>
                  </div>

                  {!isLand && (
                    <div className="sp-upload-card">
                      <h4>3) Upload Videos</h4>
                      <div className="sp-grid sp-grid-2">
                        <div className="sp-field">
                          <label>Outside View (MP4/MPEG)</label>
                          <input
                            type="file"
                            accept="video/mp4,video/mpeg"
                            onChange={(event) =>
                              setMedia((prev) => ({ ...prev, outsideView: event.target.files?.[0] || null }))
                            }
                          />
                        </div>

                        <div className="sp-field">
                          <label>Inside View (MP4/MPEG)</label>
                          <input
                            type="file"
                            accept="video/mp4,video/mpeg"
                            onChange={(event) =>
                              setMedia((prev) => ({ ...prev, insideView: event.target.files?.[0] || null }))
                            }
                          />
                        </div>
                      </div>

                      <button type="button" className="btn btn-primary" onClick={uploadVideos} disabled={uploading.videos}>
                        Upload Videos
                      </button>
                      <div className="sp-video-progress-wrap">
                        <div className="sp-video-progress-track">
                          <div className="sp-video-progress-fill" style={{ width: `${progress.videos}%` }}></div>
                        </div>
                        <span className="sp-video-progress-label">{progress.videos}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {isComplete && (
                  <div className="sp-success-box">
                    <i className="fas fa-check-circle"></i>
                    <div>
                      <strong>All uploads completed.</strong>
                      <p>Your sell property request is ready for admin review.</p>
                    </div>
                  </div>
                )}

                <div className="sp-reset-wrap">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/", {replace:true})}>Okay</button>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPropertyUploads;
