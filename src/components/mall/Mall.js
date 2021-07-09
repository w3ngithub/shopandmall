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
          {loading ? (
            <div className={classes.sliderSkeleton}>
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <Slider {...settings} className={classes.slider}>
              {docs.length !== 0 ? (
                docs?.map((doc, ind) => (
                  <div key={ind}>
                    <MallCardComponent key={doc.id} doc={doc} />
                  </div>
                ))
              ) : (
                <p className={classes.noRecords}>No any Records</p>
              )}
            </Slider>
          )}
        </div>
      ) : (
        <div className={classes.container}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)
          ) : docs.length !== 0 ? (
            docs?.map((doc) => <MallCardComponent key={doc.id} doc={doc} />)
          ) : (
            <p className={classes.noRecords}>No any Malls Yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Mall;
