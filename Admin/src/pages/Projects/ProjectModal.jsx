import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./ProjectModal.css";

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
        project.highlights?.length ? project.highlights.map((h) => h.text) : [""]
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
        JSON.stringify(highlights.filter((h) => h.trim()).map((text) => ({ text })))
      );

      // Images ONLY for create
      if (!isEdit) {
        images.forEach((img) => payload.append("images", img));
      }

      const { data } = isEdit
        ? await api.put(`/api/admin/project/update/${project._id}`, payload)
        : await api.post("/api/admin/project/create", payload);

      if (data.success) {
        toast.success(isEdit ? "Project updated successfully" : "Project created successfully");
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
    <div className="pm-modal-overlay">
      <div className="pm-modal-dialog">
        <div className="pm-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="pm-modal-header">
              <h5>{isEdit ? "Edit Project" : "Create Project"}</h5>
              <button
                type="button"
                className="pm-modal-close"
                onClick={() => onClose(false)}
              >
                ×
              </button>
            </div>

            <div className="pm-modal-body">
              <div className="pm-form-grid">
                <div className="pm-form-col-half">
                  <label className="pm-label">Category</label>
                  <select
                    name="category"
                    className="pm-input"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="real_estate">Real Estate</option>
                    <option value="startup">Startup</option>
                  </select>
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">Name</label>
                  <input
                    name="name"
                    className="pm-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">Type</label>
                  <input
                    name="type"
                    className="pm-input"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">Stage</label>
                  <input
                    name="stage"
                    className="pm-input"
                    value={formData.stage}
                    onChange={handleChange}
                  />
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">City</label>
                  <input
                    name="city"
                    className="pm-input"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">State</label>
                  <input
                    name="state"
                    className="pm-input"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                {formData.category === "real_estate" && (
                  <div className="pm-form-col-half">
                    <label className="pm-label">RERA</label>
                    <input
                      name="rera"
                      className="pm-input"
                      value={formData.rera}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="pm-form-col-half">
                  <label className="pm-label">Min Commitment</label>
                  <input
                    type="number"
                    name="minCommitment"
                    className="pm-input"
                    value={formData.minCommitment}
                    onChange={handleChange}
                  />
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">Target Return</label>
                  <input
                    name="targetReturn"
                    className="pm-input"
                    value={formData.targetReturn}
                    onChange={handleChange}
                  />
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">Target Hold</label>
                  <input
                    name="targetHold"
                    className="pm-input"
                    value={formData.targetHold}
                    onChange={handleChange}
                  />
                </div>

                <div className="pm-form-col-half">
                  <label className="pm-label">Risk</label>
                  <select
                    name="risk"
                    className="pm-input"
                    value={formData.risk}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="pm-form-col-full">
                  <label className="pm-label">Description</label>
                  <textarea
                    name="description"
                    className="pm-input pm-textarea"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="pm-form-col-full">
                  <label className="pm-label">Highlights</label>
                  {highlights.map((h, i) => (
                    <input
                      key={i}
                      className="pm-input pm-highlight-input"
                      value={h}
                      placeholder={`Highlight ${i + 1}`}
                      onChange={(e) => handleHighlightChange(i, e.target.value)}
                      style={{ marginTop: "10px" }}
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
                  <div className="pm-form-col-full">
                    <label className="pm-label">Images</label>
                    <input
                      type="file"
                      multiple
                      className="pm-input pm-file-input"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pm-modal-footer">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>{isEdit ? "Updating..." : "Creating..."}</span>
                  </>
                ) : isEdit ? (
                  "Update"
                ) : (
                  "Create"
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
