import React from "react";
import LocationStep from "../../../components/LocationStep/LocationStep";

const Step3LocationDetails = ({ location, setLocation }) => {

  const handleLocationChange = (field, value) => {
    setLocation((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="sp-section">
      <h3>Location Details</h3>
      <p>Enter complete location details so buyers can identify your property quickly.</p>
      <LocationStep location={location} handleLocationChange={handleLocationChange} />
    </section>
  );
};

export default Step3LocationDetails;
