import React from "react";
import ShopCardComponent from "../shopCardComponent/ShopCardComponent";
import Slider from "react-slick";
import classes from "./shop.module.css";
import { useLocation } from "react-router-dom";

const Shop = ({ docs, settings, isShopCategorySelected }) => {
  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" || location.pathname === "/admin/dashboard" ? (
        <div>
          <Slider {...settings} className={classes.slider}>
            {docs?.map(
              (doc, ind) =>
                doc.shops.length !== 0 && (
                  <div key={ind}>
                    <ShopCardComponent key={doc.id} doc={doc} />
                  </div>
                )
            )}
          </Slider>
        </div>
      ) : (
        <ShopCardComponent
          docs={docs}
          isShopCategorySelected={isShopCategorySelected}
        />
      )}
    </div>
  );
};

export default Shop;
