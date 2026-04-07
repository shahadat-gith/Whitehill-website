import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Startup from "./Startup/Startup";
import BusinessVenture from "./BusinessVenture/BusinessVenture";
import Property from "./Property/Property";

const FundRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const validTypes = ["startup", "business", "property"];
  const type = searchParams.get("type");

  useEffect(() => {
    // If no type is provided or the type is invalid, 
    // default to startup to prevent a blank page
    if (!type || !validTypes.includes(type)) {
      navigate("/request-funds?type=startup", { replace: true });
    }
  }, [type, navigate]);

  // Map the URL type to the specific component
  const renderFormComponent = () => {
    switch (type) {
      case "startup":
        return <Startup />;
      case "business":
        return <BusinessVenture />;
      case "property":
        return <Property />;
      default:
        return null;
    }
  };

  return (
    <div className="fund-request-page">
      <div className="fund-request-column">
        {renderFormComponent()}
      </div>
    </div>
  );
};

export default FundRequest;