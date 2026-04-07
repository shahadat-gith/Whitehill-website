import React from 'react'

const FundModal = ({setIsModalOpen, handleFundSelection}) => {
    return (
        <div className="hero-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="hero-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                <h2 className="modal-title">What do you need funds for?</h2>
                <p className="modal-sub">Select the category that best describes your request.</p>

                <div className="modal-options">
                    <label className="modal-radio-card" onClick={() => handleFundSelection("startup")}>
                        <input type="radio" name="fundType" value="startup" />
                        <div className="radio-content">
                            <i className="fas fa-rocket"></i>
                            <span>Startup</span>
                        </div>
                    </label>

                    <label className="modal-radio-card" onClick={() => handleFundSelection("businessVenture")}>
                        <input type="radio" name="fundType" value="businessVenture" />
                        <div className="radio-content">
                            <i className="fas fa-chart-line"></i>
                            <span>Business Venture</span>
                        </div>
                    </label>

                    <label className="modal-radio-card" onClick={() => handleFundSelection("property")}>
                        <input type="radio" name="fundType" value="property" />
                        <div className="radio-content">
                            <i className="fas fa-building"></i>
                            <span>Property / Land</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default FundModal