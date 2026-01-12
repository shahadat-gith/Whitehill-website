import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import ProjectModal from "./ProjectModal";
import "./ProjectDetails.css";
import ImageUploadModal from "./ImageUploadModal";

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
        <div className="pd-container">
            <div className="pd-header">
                <div>
                    <h2>{project.name}</h2>
                    <p className="pd-subtitle">
                        {project.category === "real_state" ? "Real State" : "Startup"} • {project.stage}
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => setShowEditModal(true)}
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Edit Project</span>
                </button>
            </div>

            {/* ================= IMAGES ================= */}
            {project.images?.length > 0 && (
                < div className="pd-section">
                    <h4>Project Images</h4>

                    <div className="pd-image-grid">
                        {project.images?.map((img, index) => (
                            <div key={index} className="pd-image-card">
                                <img
                                    src={img.url}
                                    alt={`Project image ${index + 1}`}
                                    loading="lazy"
                                />
                            </div>
                        ))}

                        {/* ================= UPLOAD MORE CARD ================= */}
                        <div
                            className="pd-image-card pd-upload-card"
                            onClick={() => setShowImageModal(true)}
                        >
                            <div className="pd-upload-inner">
                                <i className="fa-solid fa-plus"></i>
                                <span>Upload More</span>
                            </div>
                        </div>
                    </div>
                </div>

            )
            }


            {/* ================= DETAILS GRID ================= */}
            <div className="pd-grid">
                <div className="pd-card">
                    <span>Category</span>
                    <p>{project.category}</p>
                </div>

                <div className="pd-card">
                    <span>Type</span>
                    <p>{project.type}</p>
                </div>

                <div className="pd-card">
                    <span>City</span>
                    <p>{project.city}</p>
                </div>

                <div className="pd-card">
                    <span>State</span>
                    <p>{project.state}</p>
                </div>

                <div className="pd-card">
                    <span>Stage</span>
                    <p>{project.stage}</p>
                </div>

                <div className="pd-card">
                    <span>Target Hold</span>
                    <p>{project.targetHold}</p>
                </div>

                <div className="pd-card">
                    <span>Min Commitment</span>
                    <p>₹{project.minCommitment}</p>
                </div>

                <div className="pd-card">
                    <span>Target Return</span>
                    <p>{project.targetReturn}</p>
                </div>

                <div className="pd-card">
                    <span>Risk</span>
                    <p className={`pd-risk ${project.risk}`}>
                        {project.risk}
                    </p>
                </div>

                {project.rera && (
                    <div className="pd-card">
                        <span>RERA</span>
                        <p>{project.rera}</p>
                    </div>
                )}
            </div>


            {/* ================= DESCRIPTION ================= */}
            <div className="pd-section">
                <h4>Description</h4>
                <p>{project.description}</p>
            </div>

            {/* ================= HIGHLIGHTS ================= */}
            {
                project.highlights?.length > 0 && (
                    <div className="pd-section">
                        <h4>Highlights</h4>
                        <ul className="pd-highlights">
                            {project.highlights.map((h, i) => (
                                <li key={i}>{h.text}</li>
                            ))}
                        </ul>
                    </div>
                )
            }

            {/* ================= EDIT MODAL ================= */}
            <ProjectModal
                isOpen={showEditModal}
                project={project}
                onClose={(refresh) => {
                    setShowEditModal(false);
                    if (refresh) fetchProject();
                }}
            />

            <ImageUploadModal
                isOpen={showImageModal}
                projectId={project._id}
                onClose={(refresh) => {
                    setShowImageModal(false);
                    if (refresh) fetchProject();
                }}
            />

        </div >
    );
};

export default ProjectDetails;
