import React from "react";
import ShopCardComponent from "../shopCardComponent/ShopCardComponent";
import Slider from "react-slick";
import classes from "./shop.module.css";
import { useLocation } from "react-router-dom";
import SkeletonCard from "../../skeletons/SkeletonCard";

const Shop = ({ docs, settings, loading }) => {
  const location = useLocation();

  let empty = docs.map((doc) => doc.shops.length);

  let emptyCheck = Math.max.apply(0, empty);

  return (
    <div>
      {location.pathname === "/" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname.split("/").includes("home") ? (
        <div>
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
                docs.map((doc) => (
                  <div key={doc.id}>
                    <ShopCardComponent doc={doc} />
                  </div>
                ))
              ) : (
                <p>No any Records</p>
              )}
            </Slider>
          )}
        </div>
      ) : (
        <div>
          {loading ? (
            <div className={classes.container}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : emptyCheck !== 0 ? (
            <ShopCardComponent malls={docs} />
          ) : (
            <p className={classes.noRecords}>No any records</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
