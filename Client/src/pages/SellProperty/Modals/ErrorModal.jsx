import "../Styles/ErrorModal.css";

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="em-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="em-modal" onClick={(e) => e.stopPropagation()}>
        <div className="em-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>

        <h3 className="em-title">Something went wrong</h3>
        <p className="em-message">{message}</p>

        <button type="button" className="em-btn" onClick={onClose}>
          OK, Got it
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;