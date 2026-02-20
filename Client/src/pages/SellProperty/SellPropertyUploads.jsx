import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../Configs/axios";
import "./Styles/Layout.css";
import "./Styles/SellProperty.css";
import "./Styles/SellPropertyUploadsPage.css";

const SellPropertyUploads = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryType =
    searchParams.get("type") === "property" ? "property" : "land";

  const [requestType, setRequestType] = useState(queryType);
  const isLand = requestType === "land";

  const [documents, setDocuments] = useState({
    landOwnershipProof: null,
    khajnaReceipt: null,
    ownershipProof: null,
    buildingPlan: null,
  });

  const [media, setMedia] = useState({
    landImages: [],
    propertyImages: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const fetchRequestStatus = async () => {
      if (!id) {
        toast.error("Invalid request id");
        navigate("/sell-property", { replace: true });
        return;
      }

      try {
        setLoadingState(true);
        const { data } = await api.get(`/api/property-selling/${id}`);

        if (!data?.success) {
          throw new Error(data?.message || "Failed to load property request");
        }

        setRequestType(data.type);
        setAlreadyUploaded(data.isCompleted);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Unable to load upload status"
        );
        navigate("/sell-property", { replace: true });
      } finally {
        setLoadingState(false);
      }
    };

    fetchRequestStatus();
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!id) {
      toast.error("Invalid request id");
      return;
    }

    const hasAllDocuments = isLand
      ? Boolean(documents.landOwnershipProof && documents.khajnaReceipt)
      : Boolean(documents.ownershipProof && documents.buildingPlan);

    const imageCount = isLand
      ? media.landImages.length
      : media.propertyImages.length;

    if (!hasAllDocuments) {
      toast.error("Please upload all required documents before submitting");
      return;
    }

    if (imageCount < 4) {
      toast.error("Minimum 4 images are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      const formData = new FormData();

      if (isLand) {
        formData.append("landOwnershipProof", documents.landOwnershipProof);
        formData.append("khajnaReceipt", documents.khajnaReceipt);

        media.landImages.forEach((file) => {
          formData.append("landImages", file);
        });
      } else {
        formData.append("ownershipProof", documents.ownershipProof);
        formData.append("buildingPlan", documents.buildingPlan);

        media.propertyImages.forEach((file) => {
          formData.append("propertyImages", file);
        });
      }

      await api.post(
        `/api/property-selling/${id}/upload-files`,
        formData,
        {
          onUploadProgress: (event) => {
            if (!event.total) return;

            const percent = Math.round(
              (event.loaded * 100) / event.total
            );

            if (percent >= 100) {
              setUploadProgress(95);
            } else {
              setUploadProgress(percent);
            }
          },
        }
      );

      setUploadProgress(100);
      setSubmitted(true);
      setAlreadyUploaded(true);

      toast.success("Application files submitted successfully");

      setTimeout(() => {
        navigate(
          `/sell-property/congratulations?id=${id}&type=${queryType}&page=upload`,
          { replace: true }
        );
      }, 500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Upload failed"
      );
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-property-page spu-page">
      <div className="sell-property-layout-full">
        <div className="sell-property-column">
          <div className="ifr-container sp-container">
            <form
              className="ifr-form sp-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <section className="sp-section">
                {loadingState ? (
                  <p>Checking existing uploads...</p>
                ) : !alreadyUploaded ? (
                  <div className="sp-upload-grid">
                    <div className="sp-upload-card">
                      <h4>1) Documents</h4>
                      <div className="sp-grid sp-grid-2">
                        {isLand ? (
                          <>
                            <div className="sp-field">
                              <label>
                                Land Ownership Proof (PDF)
                                <span className="sp-required">*</span>
                              </label>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  setDocuments((prev) => ({
                                    ...prev,
                                    landOwnershipProof:
                                      e.target.files?.[0] || null,
                                  }))
                                }
                              />
                            </div>

                            <div className="sp-field">
                              <label>
                                Khajna Receipt (PDF)
                                <span className="sp-required">*</span>
                              </label>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  setDocuments((prev) => ({
                                    ...prev,
                                    khajnaReceipt:
                                      e.target.files?.[0] || null,
                                  }))
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="sp-field">
                              <label>
                                Ownership Proof (PDF)
                                <span className="sp-required">*</span>
                              </label>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  setDocuments((prev) => ({
                                    ...prev,
                                    ownershipProof:
                                      e.target.files?.[0] || null,
                                  }))
                                }
                              />
                            </div>

                            <div className="sp-field">
                              <label>
                                Building Plan (PDF)
                                <span className="sp-required">*</span>
                              </label>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  setDocuments((prev) => ({
                                    ...prev,
                                    buildingPlan:
                                      e.target.files?.[0] || null,
                                  }))
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="sp-upload-card">
                      <h4>2) Images</h4>
                      <div className="sp-field">
                        <label>
                          {isLand ? "Land Images" : "Property Images"}
                          <span className="sp-required">*</span>
                        </label>
                        <small className="sp-instruction">
                          Minimum 4 images required (JPG or PNG)
                        </small>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(
                              e.target.files || []
                            );
                            if (isLand) {
                              setMedia((prev) => ({
                                ...prev,
                                landImages: files,
                              }));
                            } else {
                              setMedia((prev) => ({
                                ...prev,
                                propertyImages: files,
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="sp-success-box">
                    <strong>Files already uploaded.</strong>
                    <p>This property selling request is complete.</p>
                  </div>
                )}

                {isSubmitting && (
                  <div className="sp-video-progress-wrap">
                    <div className="sp-video-progress-track">
                      <div
                        className="sp-video-progress-fill"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="sp-video-progress-label">
                      {uploadProgress}%
                    </span>
                  </div>
                )}

                {submitted && (
                  <div className="sp-success-box">
                    <strong>Submission completed.</strong>
                    <p>Your request is ready for admin review.</p>
                  </div>
                )}

                <div className="sp-reset-wrap">
                  {!alreadyUploaded && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting || loadingState}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/", { replace: true })}
                  >
                    Okay
                  </button>
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