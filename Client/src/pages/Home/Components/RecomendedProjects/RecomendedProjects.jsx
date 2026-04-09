import React from 'react';
import './RecomendedProjects.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../context/AppContext';

const RecomendedProjects = ({ backendProjects = [] }) => {

    const { projects } = useAppContext()

    const navigate = useNavigate()

    // Helper to get Status Class
    const getStatusClass = (stage) => {
        const s = stage?.toLowerCase();
        if (s === 'live') return 'rp-status--live';
        if (s === 'open') return 'rp-status--open';
        return 'rp-status--trending';
    };

    return (
        <section className="rp-section">
            <div className="rp-header">
                <div>
                    <p className="rp-eyebrow">Recommended Opportunities</p>
                    <h2 className="rp-title">Curated projects for high-potential investors</h2>
                    <p className="rp-subtitle">
                        Explore vetted projects with transparent funding details, strong traction, and clear growth paths.
                    </p>
                </div>
                <button className="rp-button">View all projects</button>
            </div>

            <div className="rp-grid">
                {projects.slice(0,3).map(project => (
                    <article key={project._id} className="rp-card">
                        <div className="rp-card-header">
                            <span className="rp-chip">
                                {project.category === 'real_estate' ? 'Property' : 'Startup'}
                            </span>
                            <span className={`rp-status ${getStatusClass(project.stage)}`}>
                                {project.stage || 'Trending'}
                            </span>
                        </div>

                        <h3 className="rp-card-title">{project.name}</h3>
                        <p className="rp-card-description">{project.description}</p>

                        <div className="rp-card-meta">
                            <span><i className="fas fa-map-marker-alt"></i> {project.city}, {project.state}</span>
                            <span><i className="fas fa-chart-line"></i> {project.targetReturn} Return</span>
                        </div>

                        {/* Use minCommitment as a proxy for 'Raised' in this UI example */}
                        <div className="rp-progress-row">
                            <div className="rp-progress-label">
                                <span>Min. Investment</span>
                            </div>
                            <div className="rp-progress-label">
                                <strong>₹{(project.minCommitment / 10000000).toFixed(1)}Cr</strong>
                            </div>
                        </div>

                        <div className="rp-tag-list">
                            {project.highlights.slice(0,4)?.map((tag, i) => (
                                <span key={i} className="rp-tag">{tag.text}</span>
                            ))}
                        </div>

                        <button className="rp-card-action" onClick={() => navigate(`/projects/${project._id}`)}>View & Invest</button>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default RecomendedProjects;