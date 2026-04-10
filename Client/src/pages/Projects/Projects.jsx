import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Projects.css";
import { formatCurrency, getRiskClass } from "../../Utils/utility";
import { useAppContext } from "../../context/AppContext";

const Projects = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("real_estate");
  const { projects } = useAppContext();
  const filteredProjects = projects.filter((p) => p.category === activeTab);

  return (
    <div className="proj-page">
      {/* ================= HEADER ================= */}
      <div className="proj-header">
        <h1 className="proj-title">Investment Opportunities</h1>
        <p className="proj-subtitle">
          Explore curated {activeTab === "real_estate" ? "Real Estate" : "Startup"} opportunities with verified returns.
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="proj-tabs">
        <button
          className={`proj-tab-btn ${activeTab === "real_estate" ? "proj-tab-active" : ""}`}
          onClick={() => setActiveTab("real_estate")}
        >
          <i className="fas fa-building"></i> Real Estate
        </button>

        <button
          className={`proj-tab-btn ${activeTab === "startup" ? "proj-tab-active" : ""}`}
          onClick={() => setActiveTab("startup")}
        >
          <i className="fas fa-rocket"></i> Startups
        </button>
      </div>

      {/* ================= PROJECT GRID ================= */}
      <div className="proj-grid">
        {filteredProjects.length === 0 ? (
          <div className="proj-empty">
            <i className="fas fa-folder-open"></i>
            <h3>No Projects Available</h3>
            <p>Check back later for new opportunities in this category.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div className="proj-card" key={project._id || project.id}>
              <div className="proj-card-image">
                <img src={project.images?.[0]?.url || "https://via.placeholder.com/500x300"} alt={project.name} />
                <div className={`proj-risk-badge ${getRiskClass(project.risk)}`}>
                  <i className="fas fa-shield-halved"></i> {project.risk} Risk
                </div>
              </div>

              <div className="proj-card-content">
                <div className="proj-card-header">
                  <h3>{project.name}</h3>
                  <div className="proj-location">
                    <i className="fas fa-location-dot"></i> {project.city}, {project.state}
                  </div>
                </div>

                <div className="proj-details-grid">
                  <div className="proj-detail-item">
                    <span className="proj-detail-label">Min. Investment</span>
                    <span className="proj-detail-value proj-detail-highlight">
                      {formatCurrency(project.minCommitment)}
                    </span>
                  </div>
                  <div className="proj-detail-item">
                    <span className="proj-detail-label">Target Return</span>
                    <span className="proj-detail-value proj-detail-success">
                      {project.targetReturn}
                    </span>
                  </div>
                </div>

                {/* Using Global Button Class */}
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "10px" }}
                  onClick={() => navigate(`/projects/${project._id || project.id}`)}
                >
                  View Details <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;