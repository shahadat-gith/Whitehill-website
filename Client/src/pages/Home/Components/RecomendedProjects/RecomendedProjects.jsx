import React from 'react';
import './RecomendedProjects.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../context/AppContext';

const RecomendedProjects = () => {
    const { projects } = useAppContext();
    const navigate = useNavigate();

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
                <p className="rp-eyebrow">Recommended Opportunities</p>
            </div>

            <div className="rp-grid">
                {projects.slice(0, 3).map(project => (
                    <article key={project._id} className="rp-card">
                        <div className="rp-card-header">
                            <span className="rp-chip">
                                {project.category === 'real_estate' ? 'Property' : 'Startup'}
                            </span>
                            <span className={`rp-status ${getStatusClass(project.stage)}`}>
                                <i className={`fas ${project.stage === 'live' ? 'fa-signal' : 'fa-bolt'}`} style={{marginRight: '6px'}}></i>
                                {project.stage || 'Trending'}
                            </span>
                        </div>

                        <h3 className="rp-card-title">{project.name}</h3>
                        <div className="rp-card-meta">
                            <span><i className="fas fa-map-marker-alt"></i> {project.city}, {project.state}</span>
                            <span><i className="fas fa-chart-line"></i> {project.targetReturn} Return</span>
                        </div>

                        <div className="rp-progress-row">
                            <div className="rp-progress-label">
                                <span>Min. Investment</span>
                            </div>
                            <div className="rp-progress-label">
                                <strong>₹{(project.minCommitment / 10000000).toFixed(1)}Cr</strong>
                            </div>
                        </div>
                        <div className="rp-tag-list">
                            {project.highlights.slice(0, 3)?.map((tag, i) => (
                                <span key={i} className="rp-tag">{tag.text}</span>
                            ))}
                        </div>

                        {/* Global Secondary Button used here */}
                        <button 
                            className="btn btn-secondary" 
                            style={{ width: '100%' }} 
                            onClick={() => navigate(`/projects/${project._id}`)}
                        >
                            View & Invest
                        </button>
                    </article>
                ))}
            </div>

            <div className="rp-action-btns" style={{ marginTop: '40px', textAlign: 'center' }}>
                {/* Global Primary Button used here */}
                <button 
                    onClick={() => navigate("/projects")} 
                    className='btn btn-primary'
                >
                    Explore All Opportunities <i className="fas fa-arrow-right"></i>
                </button>
            </div>
        </section>
    );
}

export default RecomendedProjects;