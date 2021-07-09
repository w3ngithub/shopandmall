import React from "react";
import ShopCardComponent from "../shopCardComponent/ShopCardComponent";
import Slider from "react-slick";
import classes from "./shop.module.css";
import { useLocation } from "react-router-dom";
import SkeletonCard from "../../skeletons/SkeletonCard";

const Shop = ({ docs, settings, isShopCategorySelected, loading }) => {
  const location = useLocation();
  return (
    <div>
      {location.pathname === "/" || location.pathname === "/admin/dashboard" ? (
        <div>
          {loading ? (
            <div className={classes.sliderSkeleton}>
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
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
          ) : docs.length !== 0 ? (
            <ShopCardComponent docs={docs} />
          ) : (
            <p className={classes.noRecords}>No any Shops Yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
