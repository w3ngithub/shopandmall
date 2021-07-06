import React from "react";
import classes from "./mall.module.css";
import MallCardComponent from "../mallCardComponent/MallCardComponent";

import Slider from "react-slick";

import { useLocation } from "react-router-dom";

const Mall = ({ docs, settings }) => {
  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" || location.pathname === "/admin/dashboard" ? (
        docs.length === 0 ? (
          <h3 className={classes.empty}>No any records</h3>
        ) : (
          <div className={classes.sliderContainer}>
            <Slider {...settings} className={classes.slider}>
              {docs?.map((doc, ind) => (
                <div key={ind}>
                  <MallCardComponent key={doc.id} doc={doc} />
                </div>
              ))}
            </Slider>
          </div>
        )
      ) : (
        <div className={classes.container}>
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
