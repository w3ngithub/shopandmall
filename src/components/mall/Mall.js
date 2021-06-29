import React from "react";
import classes from "./mall.module.css";
import MallCardComponent from "../mallCardComponent/MallCardComponent";

import Slider from "react-slick";

import { useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Mall = ({ docs, settings }) => {
  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" || location.pathname === "/admin/dashboard" ? (
        <div>
          <Slider {...settings} className={classes.slider}>
            {docs?.map((doc, ind) => (
              <div key={ind}>
                <MallCardComponent key={doc.id} doc={doc} />
              </div>
            ))}
          </Slider>
        </div>
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
