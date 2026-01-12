import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";

const ProjectModal = ({ isOpen, onClose, project = null }) => {
  const isEdit = Boolean(project?._id);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: "real_estate",
    name: "",
    type: "",
    city: "",
    state: "",
    stage: "",
    targetHold: "",
    minCommitment: "",
    targetReturn: "",
    risk: "medium",
    description: "",
    rera: "",
  });

  const [images, setImages] = useState([]);
  const [highlights, setHighlights] = useState([""]);

  /* ================= PREFILL ON EDIT ================= */
  useEffect(() => {
    if (project) {
      setFormData({
        category: project.category || "real_estate",
        name: project.name || "",
        type: project.type || "",
        city: project.city || "",
        state: project.state || "",
        stage: project.stage || "",
        targetHold: project.targetHold || "",
        minCommitment: project.minCommitment || "",
        targetReturn: project.targetReturn || "",
        risk: project.risk || "medium",
        description: project.description || "",
        rera: project.rera || "",
      });

      setHighlights(
        project.highlights?.length
          ? project.highlights.map((h) => h.text)
          : [""]
      );
    }
  }, [project]);

  if (!isOpen) return null;

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleHighlightChange = (index, value) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  const addHighlight = () => setHighlights([...highlights, ""]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") payload.append(key, value);
      });

      payload.append(
        "highlights",
        JSON.stringify(
          highlights.filter((h) => h.trim()).map((text) => ({ text }))
        )
      );

      // Images ONLY for create
      if (!isEdit) {
        images.forEach((img) => payload.append("images", img));
      }

      const { data } = isEdit
        ? await api.put(
            `/api/admin/project/update/${project._id}`,
            payload
          )
        : await api.post("/api/admin/project/create", payload);

      if (data.success) {
        toast.success(
          isEdit
            ? "Project updated successfully"
            : "Project created successfully"
        );
        onClose(true);
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pr-modal-overlay">
      <div className="pr-modal-dialog">
        <div className="pr-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="pr-modal-header">
              <h5>{isEdit ? "Edit Project" : "Create Project"}</h5>
              <button
                type="button"
                className="pr-modal-close"
                onClick={() => onClose(false)}
              >
                ×
              </button>
            </div>

            <div className="pr-modal-body">
              <div className="pr-form-grid">
                <div className="pr-form-col-half">
                  <label className="pr-label">Category</label>
                  <select
                    name="category"
                    className="pr-input"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="real_estate">Real Estate</option>
                    <option value="startup">Startup</option>
                  </select>
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">Name</label>
                  <input
                    name="name"
                    className="pr-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">Type</label>
                  <input
                    name="type"
                    className="pr-input"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">Stage</label>
                  <input
                    name="stage"
                    className="pr-input"
                    value={formData.stage}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">City</label>
                  <input
                    name="city"
                    className="pr-input"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">State</label>
                  <input
                    name="state"
                    className="pr-input"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                {formData.category === "real_estate" && (
                  <div className="pr-form-col-half">
                    <label className="pr-label">RERA</label>
                    <input
                      name="rera"
                      className="pr-input"
                      value={formData.rera}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="pr-form-col-half">
                  <label className="pr-label">Min Commitment</label>
                  <input
                    type="number"
                    name="minCommitment"
                    className="pr-input"
                    value={formData.minCommitment}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">Target Return</label>
                  <input
                    name="targetReturn"
                    className="pr-input"
                    value={formData.targetReturn}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">Target Hold</label>
                  <input
                    name="targetHold"
                    className="pr-input"
                    value={formData.targetHold}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-form-col-half">
                  <label className="pr-label">Risk</label>
                  <select
                    name="risk"
                    className="pr-input"
                    value={formData.risk}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="pr-form-col-full">
                  <label className="pr-label">Description</label>
                  <textarea
                    name="description"
                    className="pr-input pr-textarea"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-form-col-full">
                  <label className="pr-label">Highlights</label>
                  {highlights.map((h, i) => (
                    <input
                      key={i}
                      className="pr-input pr-highlight-input"
                      value={h}
                      placeholder={`Highlight ${i + 1}`}
                      onChange={(e) =>
                        handleHighlightChange(i, e.target.value)
                      }
                      style={{marginTop:"10px"}}
                    />
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addHighlight}
                    style={{ marginTop: "10px" }}
                  >
                    + Add Highlight
                  </button>
                </div>

                {/* ================= IMAGES (CREATE ONLY) ================= */}
                {!isEdit && (
                  <div className="pr-form-col-full">
                    <label className="pr-label">Images</label>
                    <input
                      type="file"
                      multiple
                      className="pr-input pr-file-input"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pr-modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>
                      {isEdit ? "Updating..." : "Creating..."}
                    </span>
                  </>
                ) : (
                  isEdit ? "Update" : "Create"
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                disabled={submitting}
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
