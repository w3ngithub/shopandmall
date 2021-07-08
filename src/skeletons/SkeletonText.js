import "./Skeleton.css";
import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const SkeletonText = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="filterText">
        <SkeletonElement type="text2" />
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonText;
