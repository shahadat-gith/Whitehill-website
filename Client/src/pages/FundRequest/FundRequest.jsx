import React, { useState } from "react";
import "./Styles/FundRequest.css";
import StartupFundRequest from "./StartupFundRequest";
import BusinessFundRequest from "./BusinessFundRequest";
import IndividualFundRequest from "./IndividualFundRequest";

const FundRequest = () => {
  const [type, setType] = useState("startup");

  return (
    <div className="fund-request-page">
      <div className="fund-request-layout-full">
        <div className="fund-request-column">
          <div className="fund-card">
            <h2>Need fund for?</h2>
            <div className="fund-tabs">
              <button
                type="button"
                className={`fund-tab ${type === "startup" ? "active" : ""}`}
                onClick={() => setType("startup")}
              >
                Startup
              </button>

              <button
                type="button"
                className={`fund-tab ${type === "business" ? "active" : ""}`}
                onClick={() => setType("business")}
              >
                Business Venture
              </button>

              <button
                type="button"
                className={`fund-tab ${type === "individual" ? "active" : ""}`}
                onClick={() => setType("individual")}
              >
                Individual
              </button>
            </div>
          </div>

          {type === "startup" && <StartupFundRequest />}
          {type === "business" && <BusinessFundRequest />}
          {type === "individual" && <IndividualFundRequest />}
        </div>
      </div>
    </div>
  );
};

export default FundRequest;
