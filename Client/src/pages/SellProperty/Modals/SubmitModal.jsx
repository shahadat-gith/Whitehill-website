import "../Styles/SubmitModal.css";

const SubmitModal = ({ isOpen, progress }) => {
  if (!isOpen) return null;

  const getStatusText = () => {
    if (progress < 30) return "Preparing your files...";
    if (progress < 60) return "Uploading documents...";
    if (progress < 90) return "Uploading images...";
    if (progress < 100) return "Finalizing submission...";
    return "Almost done!";
  };

  return (
    <div className="sm-overlay" role="dialog" aria-modal="true">
      <div className="sm-modal">
        <div
          className="sm-circle"
          style={{
            background: `conic-gradient(var(--primary-blue) ${progress * 3.6}deg, var(--bg-light-gray) 0deg)`,
          }}
        >
          <div className="sm-circle-inner">
            <span className="sm-percent">{progress}%</span>
          </div>
        </div>

        <h3 className="sm-title">Uploading & Submitting</h3>
        <p className="sm-status">{getStatusText()}</p>
        <p className="sm-note">Please don't close or refresh this page.</p>

        <div className="sm-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;