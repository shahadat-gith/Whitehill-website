import React from 'react';
import './styles/SubmitModal.css';

const SubmitModal = ({ show, status, error, onClose, onRedirect }) => {
  if (!show) return null;

  // We determine if the UI should be "locked"
  const isLocked = status === 'processing';

  return (
    <div 
      className={`submit-modal-overlay ${isLocked ? 'overlay-locked' : ''}`}
      onClick={!isLocked ? onClose : null} // Disable overlay click-to-close when processing
    >
      <div 
        className="submit-modal-card" 
        onClick={(e) => e.stopPropagation()} // Prevent card clicks from bubbling to overlay
      >
        
        {/* Visual Feedback Area */}
        <div className="status-visual">
          {status === 'processing' && (
            <div className="submit-spinner">
              <div></div><div></div><div></div>
            </div>
          )}
          {status === 'success' && <div className="success-icon">✓</div>}
          {status === 'error' && <div className="error-icon">!</div>}
        </div>

        <h2 className="submit-modal-title">
          {status === 'processing' && 'Submitting Application...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Submission Error'}
        </h2>

        <p className="submit-modal-desc">
          {status === 'processing' && 'Please wait while we secure your data. This may take a few moments. Do not refresh the page.'}
          {status === 'success' && 'Your funding request has been recorded. Our analysts will reach out shortly.'}
          {status === 'error' && (error || 'Something went wrong. Please try again.')}
        </p>

        <div className="submit-modal-actions">
          {/* ONLY show buttons if NOT processing */}
          {!isLocked && (
            <>
              {status === 'success' ? (
                <button type="button" className="btn btn-primary" onClick={onRedirect}>
                  Go to Dashboard
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  Try Again
                </button>
              )}
              
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;