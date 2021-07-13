import React from "react";
import Shimmer from "./Shimmer";

const SkeletonBlock = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="block"></div>
      <Shimmer />
    </div>
  );
};

export default SkeletonBlock;
