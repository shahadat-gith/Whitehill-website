import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        {/* Animated 404 */}
        <div className="error-code">
          <span className="digit-4">4</span>
          <span className="digit-0">0</span>
          <span className="digit-4-2">4</span>
        </div>

        {/* Message */}
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-description">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Buttons */}
        <div className="notfound-buttons">
          <button 
            className="btn-home"
            onClick={() => navigate('/')}
          >
            <i className="fa-solid fa-home"></i>
            Go Home
          </button>
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="decorative-circle circle-1"></div>
        <div className="decorative-circle circle-2"></div>
        <div className="decorative-circle circle-3"></div>
      </div>
    </div>
  );
};

export default NotFound;