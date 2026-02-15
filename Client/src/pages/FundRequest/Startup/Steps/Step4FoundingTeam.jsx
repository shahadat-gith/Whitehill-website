import "./Steps.css"

const Step4FoundingTeam = ({ foundingTeam, handleFoundingTeamChange, addFoundingTeamMember, removeFoundingTeamMember }) => {
    return (
        <section className="sfr-section">
            <div className="sfr-section-content">
                <div className="sfr-team-list">
                    {foundingTeam.map((member, index) => (
                        <div className="sfr-team-card" key={`member-${index}`}>
                            <div className="sfr-team-card-header">
                                <div className="sfr-team-badge">Member {index + 1}</div>
                                {foundingTeam.length > 1 && (
                                    <button
                                        type="button"
                                        className="sfr-remove-btn"
                                        onClick={() => removeFoundingTeamMember(index)}
                                        title="Remove team member"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                            <div className="sfr-team-card-content">
                                <div className="sfr-grid sfr-grid-2">
                                    <div className="sfr-field">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={member.name}
                                            onChange={(e) =>
                                                handleFoundingTeamChange(index, "name", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="sfr-field">
                                        <label>Role *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Co-Founder & CEO"
                                            value={member.role}
                                            onChange={(e) =>
                                                handleFoundingTeamChange(index, "role", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="sfr-grid sfr-grid-2">
                                    <div className="sfr-field">
                                        <label>Equity Stake (%) *</label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 40"
                                            value={member.equityStake}
                                            onChange={(e) =>
                                                handleFoundingTeamChange(index, "equityStake", e.target.value)
                                            }
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>
                                    <div className="sfr-field">
                                        <label>LinkedIn Profile</label>
                                        <input
                                            type="url"
                                            placeholder="https://linkedin.com/in/username"
                                            value={member.linkedinProfile}
                                            onChange={(e) =>
                                                handleFoundingTeamChange(index, "linkedinProfile", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addFoundingTeamMember}
                >
                    <i className="fas fa-plus"></i> Add Team Member
                </button>
            </div>
        </section>
    );
};

export default Step4FoundingTeam;
