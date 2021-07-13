import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const SkeletonCard = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="image"></div>
      <Shimmer />
    </div>
  );
};

export default SkeletonCard;
