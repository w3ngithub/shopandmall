import React from "react";
import ShopCardComponent from "../shopCardComponent/ShopCardComponent";
import Slider from "react-slick";
import classes from "./shop.module.css";
import { useLocation } from "react-router-dom";
import SkeletonCard from "../../skeletons/SkeletonCard";

const Shop = ({ docs, settings, isShopCategorySelected, loading }) => {
  const location = useLocation();
  console.log(docs);
  return (
    <div>
      {location.pathname === "/" || location.pathname === "/admin/dashboard" ? (
        <div>
          <Slider {...settings} className={classes.slider}>
            {loading ? (
              [1, 2, 3].map((n) => <SkeletonCard key={n} />)
            ) : docs.length !== 0 ? (
              docs.map((doc) => (
                <div key={doc.id}>
                  <ShopCardComponent doc={doc} />
                </div>
              ))
            ) : (
              <p>No any Records</p>
            )}
          </Slider>
        </div>
      ) : (
        <ShopCardComponent
          malls={docs}
          isShopCategorySelected={isShopCategorySelected}
        />
      )}
    </div>
  );
};

export default Shop;
