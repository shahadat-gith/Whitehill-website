import "../Styles/Step4Uploads.css"

const Step4Uploads = ({
  isLand,
  setDocuments,
  setMedia,
}) => {
  return (
    <section className="sp4-section">
      <div className="sp4-grid">

        {/* Documents Block */}
        <div className="sp4-card">
          <h4 className="sp4-title">1) Documents</h4>

          <div className="sp4-grid-2">
            {isLand ? (
              <>
                <div className="sp4-field">
                  <label className="sp4-label">
                    Land Ownership Proof (PDF)
                    <span className="sp4-required">*</span>
                  </label>
                  <input
                    className="sp4-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) =>
                      setDocuments((prev) => ({
                        ...prev,
                        landOwnershipProof: event.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>

                <div className="sp4-field">
                  <label className="sp4-label">
                    Khajna Receipt (PDF)
                    <span className="sp4-required">*</span>
                  </label>
                  <input
                    className="sp4-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) =>
                      setDocuments((prev) => ({
                        ...prev,
                        khajnaReceipt: event.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="sp4-field">
                  <label className="sp4-label">
                    Ownership Proof (PDF)
                    <span className="sp4-required">*</span>
                  </label>
                  <input
                    className="sp4-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) =>
                      setDocuments((prev) => ({
                        ...prev,
                        ownershipProof: event.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>

                <div className="sp4-field">
                  <label className="sp4-label">
                    Building Plan (PDF)
                    <span className="sp4-required">*</span>
                  </label>
                  <input
                    className="sp4-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) =>
                      setDocuments((prev) => ({
                        ...prev,
                        buildingPlan: event.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Images Block */}
        <div className="sp4-card">
          <h4 className="sp4-title">2) Images</h4>

          <div className="sp4-field">
            <label className="sp4-label">
              {isLand ? "Land Images" : "Property Images"}
              <span className="sp4-required">*</span>
            </label>

            <p className="sp4-help">
              Minimum 1 image required (JPG or PNG)
            </p>

            <input
              className="sp4-input"
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
        </div>

      </div>
    </section>
  );
};

export default Step4Uploads;