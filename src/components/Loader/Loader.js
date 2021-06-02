import "./loader.css";
import React from "react";

const Loader = () => {
  return (
    <div className="spinnerContianer">
      <div className="spinner">
        <div className="spinner-text">Loading</div>
        <div className="spinner-sector spinner-sector-red"></div>
        <div className="spinner-sector spinner-sector-blue"></div>
        <div className="spinner-sector spinner-sector-green"></div>
      </div>
    </div>
  );
};

export default Loader;
