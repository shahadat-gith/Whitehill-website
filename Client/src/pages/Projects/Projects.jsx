import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Projects.css";
import api from "../../Configs/axios";
import Loader from "../../components/Loader/Loader";
import { formatCurrency, getRiskClass } from "../../Utils/utility";

/* ================= PAGE ================= */
const Projects = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("real_estate");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    state: "",
    minCommitment: "",
    risk: "",
  });

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/project/projects");
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredProjects = projects.filter((project) => {
    if (project.category !== activeTab) return false;
    if (filters.state && project.state !== filters.state) return false;
    if (
      filters.minCommitment &&
      project.minCommitment < Number(filters.minCommitment)
    )
      return false;
    if (filters.risk && project.risk !== filters.risk) return false;
    return true;
  });

  const resetFilters = () => {
    setFilters({ state: "", minCommitment: "", risk: "" });
  };


  if (loading) {
    return <Loader  />;
  }

  return (
    <div className="proj-page">
      {/* ================= HEADER ================= */}
      <div className="proj-header">
        <div className="proj-header-content">
          <h1>Investment Opportunities</h1>
          <p className="proj-subtitle">
            Explore curated Real Estate and Startup investment opportunities with verified returns
          </p>
        </div>

        <div className="proj-stats">
          <div className="proj-stat-item">
            <span className="proj-stat-value">{projects.length}</span>
            <span className="proj-stat-label">Active Projects</span>
          </div>
          <div className="proj-stat-item">
            <span className="proj-stat-value">
              {projects.filter((p) => p.category === "real_estate").length}
            </span>
            <span className="proj-stat-label">Real Estate</span>
          </div>
          <div className="proj-stat-item">
            <span className="proj-stat-value">
              {projects.filter((p) => p.category === "startup").length}
            </span>
            <span className="proj-stat-label">Startups</span>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="proj-tabs">
        <button
          className={`proj-tab ${activeTab === "real_estate" ? "proj-tab-active" : ""}`}
          onClick={() => {
            setActiveTab("real_estate");
            resetFilters();
          }}
        >
          <i className="fas fa-building"></i>
          Real Estate
        </button>

        <button
          className={`proj-tab ${activeTab === "startup" ? "proj-tab-active" : ""}`}
          onClick={() => {
            setActiveTab("startup");
            resetFilters();
          }}
        >
          <i className="fas fa-rocket"></i>
          Startups / Ventures
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="proj-filters">
        <div className="proj-filters-title">
          <i className="fas fa-filter"></i>
          Filters
        </div>

        <div className="proj-filters-group">
          <select
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          >
            <option value="">All States</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Haryana">Haryana</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Goa">Goa</option>
            <option value="Telangana">Telangana</option>
          </select>

          <select
            value={filters.minCommitment}
            onChange={(e) =>
              setFilters({ ...filters, minCommitment: e.target.value })
            }
          >
            <option value="">Min Commitment</option>
            <option value="250000">₹2.5L+</option>
            <option value="500000">₹5L+</option>
            <option value="750000">₹7.5L+</option>
            <option value="1000000">₹10L+</option>
          </select>

          <select
            value={filters.risk}
            onChange={(e) => setFilters({ ...filters, risk: e.target.value })}
          >
            <option value="">Risk Level</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          {(filters.state || filters.minCommitment || filters.risk) && (
            <button className="proj-filter-reset" onClick={resetFilters}>
              <i className="fas fa-times"></i> Reset
            </button>
          )}
        </div>
      </div>

      {/* ================= PROJECT CARDS ================= */}
      <div className="proj-grid">
        {loading ? (
          <div className="proj-empty">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="proj-empty">
            <i className="fas fa-search"></i>
            <h3>No Projects Found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button className="proj-btn-reset" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              className="proj-card"
              key={project._id || project.id}
            >
              <div className="proj-card-image">
                <img
                  src={
                    project.images?.[0]?.url ||
                    project.image ||
                    "https://via.placeholder.com/500x300"
                  }
                  alt={project.name}
                />
                <div className={`proj-risk-badge ${getRiskClass(project.risk)}`}>
                  {project.risk} Risk
                </div>
              </div>

              <div className="proj-card-content">
                <div className="proj-card-header">
                  <h3>{project.name}</h3>
                  <span className="proj-type-badge">{project.type}</span>
                </div>

                <div className="proj-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {project.city}, {project.state}
                </div>

                {project.rera && (
                  <div className="proj-rera">
                    <i className="fas fa-certificate"></i>
                    RERA: {project.rera}
                  </div>
                )}

                <p className="proj-description">{project.description}</p>

                <div className="proj-details-grid">
                  <div className="proj-detail-item">
                    <span className="proj-detail-label">Stage</span>
                    <span className="proj-detail-value">{project.stage}</span>
                  </div>
                  <div className="proj-detail-item">
                    <span className="proj-detail-label">Target Hold</span>
                    <span className="proj-detail-value">{project.targetHold}</span>
                  </div>
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

                <button
                  className="proj-view-btn"
                  onClick={() =>
                    navigate(`/projects/${project._id || project.id}`)
                  }
                >
                  <span>View Details</span>
                  <i className="fas fa-arrow-right"></i>
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
