import React from "react";
import Slider from "react-slick";
import classes from "./mall.module.css";
import { useLocation } from "react-router-dom";
import SkeletonCard from "../../skeletons/SkeletonCard";
import MallCardComponent from "../mallCardComponent/MallCardComponent";

const Mall = ({ docs, settings, loading }) => {
  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname.split("/")[1] === "home" ||
      location.pathname.split("/")[2] === "category" ? (
        <div className={classes.sliderContainer}>
          {loading ? (
            <>
              <div className={classes.sliderSkeletonDesktop}>
                {[1, 2, 3].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
              <div className={classes.sliderSkeletonTab}>
                {[1, 2].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
              <div className={classes.sliderSkeletonMobile}>
                {[1].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            </>
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
