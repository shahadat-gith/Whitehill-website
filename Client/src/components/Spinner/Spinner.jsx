import React from "react";
import "./Spinner.css";

const Spinner = ({ size = "medium", color = "primary" }) => {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className={`spinner spinner-${color}`}></div>
    </div>
  );
};

export default Spinner;