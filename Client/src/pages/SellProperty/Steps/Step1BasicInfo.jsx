import React from "react";

const Step1BasicInfo = ({ sellRequest, setSellRequest }) => {

  const handlePriceChange = (value) => {
    setSellRequest((prev) => ({ ...prev, priceAsked: value }));
  };

  return (
    <section className="sp-section">
      <div className="sp-grid sp-grid-2">
        <div className="sp-field">
          <label>Asking Price (₹) *</label>
          <input
            type="number"
            min="1"
            value={sellRequest.priceAsked}
            onChange={(event) => handlePriceChange(event.target.value)}
            placeholder="Enter expected asking price"
            required
          />
        </div>
      </div>
    </section>
  );
};

export default Step1BasicInfo;
