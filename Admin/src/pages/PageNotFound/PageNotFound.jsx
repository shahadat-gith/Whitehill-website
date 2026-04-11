import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="pnf-container">
      <div className="pnf-card">

        {/* ICON */}
        <div className="pnf-icon">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        {/* TEXT */}
        <h1 className="pnf-title">404</h1>
        <h3 className="pnf-subtitle">Page Not Found</h3>
        <p className="pnf-text">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* ACTIONS */}
        <div className="pnf-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Go Back</span>
          </button>

          <button className="btn btn-primary" onClick={() => navigate("/")}>
            <i className="fa-solid fa-house"></i>
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;