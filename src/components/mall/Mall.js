import React from "react";
import classes from "./mall.module.css";
import MallCardComponent from "../mallCardComponent/MallCardComponent";

import Slider from "react-slick";

import { useLocation } from "react-router-dom";

import SkeletonCard from "../../skeletons/SkeletonCard";

const Mall = ({ docs, settings, loading }) => {
  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" || location.pathname === "/admin/dashboard" ? (
        <div className={classes.sliderContainer}>
          <Slider {...settings} className={classes.slider}>
            {loading ? (
              [1, 2, 3].map((n) => <SkeletonCard key={n} />)
            ) : docs.length !== 0 ? (
              docs?.map((doc, ind) => (
                <div key={ind}>
                  <MallCardComponent key={doc.id} doc={doc} />
                </div>
              ))
            ) : (
              <p className={classes.noRecords}>No any Records</p>
            )}
          </Slider>
        </div>
      ) : (
        <div className={classes.container}>
          {docs.length === 0 && [1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          {docs?.map(
            (doc, ind) =>
              ind <= 2 && <MallCardComponent key={doc.id} doc={doc} />
          )}
        </div>
      )}
    </div>
  );
};

export default Mall;
