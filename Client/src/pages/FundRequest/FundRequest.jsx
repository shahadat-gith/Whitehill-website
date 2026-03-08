import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./FundRequest.css";
import Startup from "./Startup/Startup";
import BusinessVenture from "./BusinessVenture/BusinessVenture";
import Property from "./Property/Property";

const FundRequest = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTypes = ["startup", "businessVenture", "property"];
  const typeParam = searchParams.get("type");
  const type = validTypes.includes(typeParam) ? typeParam : "startup";

  useEffect(() => {
    if (!typeParam || !validTypes.includes(typeParam)) {
      setSearchParams({ type: "startup" }, { replace: true });
    }
  }, [typeParam, setSearchParams]);

  const handleTypeChange = (newType) => {
    setSearchParams({ type: newType });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fund-request-page">
      <div className="fund-request-column">
        <div className="fund-card">
          <h2>Need fund for?</h2>
          <div className="fund-tabs">
            <button
              type="button"
              className={`fund-tab ${type === "startup" ? "active" : ""}`}
              onClick={() => handleTypeChange("startup")}
            >
              Startup
            </button>

            <button
              type="button"
              className={`fund-tab ${type === "businessVenture" ? "active" : ""}`}
              onClick={() => handleTypeChange("businessVenture")}
            >
              Business Venture
            </button>

            <button
              type="button"
              className={`fund-tab ${type === "property" ? "active" : ""}`}
              onClick={() => handleTypeChange("property")}
            >
              Land / Property
            </button>
          </div>
        </div>

        {type === "startup" && <Startup />}
        {type === "businessVenture" && <BusinessVenture />}
        {type === "property" && <Property />}
      </div>
    </div>
  );
};

export default FundRequest;
