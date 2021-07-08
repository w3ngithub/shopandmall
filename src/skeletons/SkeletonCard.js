import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const SkeletonCard = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-card">
        <SkeletonElement type="card" />
        <div className="skeleton-text">
          <SkeletonElement type="text1" />
          <SkeletonElement type="text1" />
        </div>
        <SkeletonElement type="text2" />
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonCard;
