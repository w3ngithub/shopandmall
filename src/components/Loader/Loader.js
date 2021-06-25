import "./loader.css";
import React from "react";

const Loader = ({ loadingPercentage }) => {
  return (
    <div className="loader">
      <span style={{ width: `${loadingPercentage}%` }}></span>
      <p>{loadingPercentage}%</p>
    </div>
  );
};

export default Loader;
