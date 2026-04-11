import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import ProjectModal from "./ProjectModal";
import ImageUploadModal from "./ImageUploadModal";
import "./ProjectDetails.css";

const ProjectDetails = () => {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    /* ================= FETCH PROJECT ================= */
    const fetchProject = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/project/get-project/${projectId}`);

            if (data.success) {
                setProject(data.project);
            } else {
                toast.error("Failed to load project");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="pd-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Loading project...</span>
            </div>
        );
    }

    if (!project) return null;

    return (
        <>
            <div className="pd-container">
                {/* ================= HEADER ================= */}
                <header className="pd-header">
                    <div className="pd-header-content">
                        <div className="pd-badge">
                            {project.category.replace("_", " ")}
                        </div>
                        <h1>{project.name}</h1>
                        <p className="pd-location">
                            <i className="fa-solid fa-location-dot"></i>{" "}
                            {project.city}, {project.state}
                        </p>
                    </div>

                    <button
                        className="btn-edit"
                        onClick={() => setShowEditModal(true)}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                        Edit Details
                    </button>
                </header>

                {/* ================= TOP ROW ================= */}
                <div className="pd-top-row">
                    {/* Gallery */}
                    <section className="pd-gallery-section">
                        <div className="pd-section-title">Project Gallery</div>

                        <div className="pd-image-grid">
                            {project.images?.map((img, index) => (
                                <div key={index} className="pd-image-card">
                                    <img src={img.url} alt="Project" />
                                </div>
                            ))}

                            <div
                                className="pd-upload-placeholder"
                                onClick={() => setShowImageModal(true)}
                            >
                                <i className="fa-solid fa-plus"></i>
                                <span>Add Image</span>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <aside className="pd-quick-stats">
                        <div className="stat-group">
                            <label>Minimum Commitment</label>
                            <div className="stat-value primary">
                                ₹{project.minCommitment.toLocaleString("en-IN")}
                            </div>
                        </div>

                        <div className="stat-group">
                            <label>Target Return</label>
                            <div className="stat-value highlight">
                                {project.targetReturn}
                            </div>
                        </div>

                        <div className={`risk-banner ${project.risk}`}>
                            <i className="fa-solid fa-shield-halved"></i>
                            <span>{project.risk.toUpperCase()} RISK PROFILE</span>
                        </div>
                    </aside>
                </div>

                {/* ================= INFO GRID ================= */}
                <div className="pd-info-grid">
                    <div className="info-card">
                        <h4>
                            <i className="fa-solid fa-circle-info"></i> Project Specs
                        </h4>

                        <div className="info-row">
                            <span>Type</span>
                            <strong>{project.type}</strong>
                        </div>

                        <div className="info-row">
                            <span>Stage</span>
                            <strong>{project.stage}</strong>
                        </div>

                        <div className="info-row">
                            <span>Target Hold</span>
                            <strong>{project.targetHold}</strong>
                        </div>

                        {project.rera && (
                            <div className="info-row">
                                <span>RERA ID</span>
                                <strong>{project.rera}</strong>
                            </div>
                        )}
                    </div>

                    <div className="info-card description-card">
                        <h4>
                            <i className="fa-solid fa-align-left"></i> Description
                        </h4>
                        <p>{project.description}</p>
                    </div>
                </div>

                {/* ================= HIGHLIGHTS ================= */}
                {project.highlights?.length > 0 && (
                    <section className="pd-highlights-section">
                        <h4>Key Highlights</h4>

                        <div className="highlights-container">
                            {project.highlights.map((h, i) => (
                                <div key={i} className="highlight-tag">
                                    <i className="fa-solid fa-check-double"></i>
                                    {h.text}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <ProjectModal
                isOpen={showEditModal}
                project={project}
                onClose={(success) => {
                    setShowEditModal(false);

                    if (success) {
                        fetchProject(); // refresh after update
                    }
                }}
            />
            <ImageUploadModal
                isOpen={showImageModal}
                projectId={projectId}
                onClose={(success) => {
                    setShowImageModal(false);

                    if (success) {
                        fetchProject(); // refresh gallery
                    }
                }}
            />
        </>
    );
};

export default ProjectDetails;