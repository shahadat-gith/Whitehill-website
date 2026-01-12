import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import "./Projects.css";
import toast from "react-hot-toast";
import ProjectModal from "./ProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  /* ================= FETCH PROJECTS ================= */
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/project/projects");

      if (data.success) {
        setProjects(data.projects || []);
      } else {
        toast.error("Failed to load projects");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="pr-container">
      <div className="pr-header">
        <h4>Projects</h4>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Project
        </button>
      </div>

      {/* ================= PROJECT TABLE ================= */}
      <div className="pr-table-wrapper">
        <table className="pr-table pr-table-bordered">
          <thead className="pr-table-header">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>City</th>
              <th>Stage</th>
              <th>Min Commitment</th>
              <th>Target Return</th>
              <th>Risk</th>
              <th style={{ width: "110px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="pr-loading-cell">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Loading projects...</span>
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan="8" className="pr-empty-cell">
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.city}</td>
                  <td>{p.stage}</td>
                  <td>₹{p.minCommitment}</td>
                  <td>{p.targetReturn}</td>
                  <td className="pr-text-capitalize">{p.risk}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/projects/${p._id}`)}
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span style={{ marginLeft: "6px" }}>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= CREATE PROJECT MODAL ================= */}
      <ProjectModal
        isOpen={showModal}
        onClose={(refresh) => {
          setShowModal(false);
          if (refresh) fetchProjects();
        }}
      />
    </div>
  );
};

export default Projects;
