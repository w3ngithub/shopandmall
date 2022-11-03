/* eslint-disable */
import Slider from "react-slick";
import classes from "./shop.module.css";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SkeletonCard from "../../skeletons/SkeletonCard";
import ShopCardComponent from "../shopCardComponent/ShopCardComponent";

const Shop = ({ docs, settings, loading, shops }) => {
  const [shops1, setShops1] = useState([]);

  const location = useLocation();

  let empty = docs.map((doc) => doc.shops);

  let emptyCheck = Math.max.apply(0, empty);

  // useEffect(() => {
  //   setShops1(shops);
  // }, [shops]);

  let sortedShops = [];
  const getShops = (index) => {
    let totalShops = 0;
    docs?.map((mall, i) => {
      totalShops += mall.shops.length;
      if (mall.shops.length > 0 && mall.shops[index]) {
        mall.shops[index].mall = mall;
        sortedShops.push(mall.shops[index]);
      }
      if (
        i === docs.length - 1 &&
        sortedShops.length < totalShops &&
        sortedShops.length <= 9
      ) {
        getShops(index + 1);
      }
    });
  };
  getShops(0);
  return (
    <div>
      {location.pathname === "/" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname.split("/")[1] === "home" ||
      location.pathname.split("/")[2] === "home" ||
      location.pathname.split("/")[2] === "category" ||
      location.pathname.split("/")[3] === "category" ? (
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
              {sortedShops.length !== 0 && emptyCheck !== 0 ? (
                sortedShops?.map((doc, i) => (
                  <div key={doc.id}>
                    <ShopCardComponent doc={doc} malls={docs} />
                  </div>
                ))
              ) : (
                <p className={classes.noRecords}>No shops added</p>
              )}
            </Slider>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto",
            rowGap: "20px",
            margin: "20px 0",
          }}
        >
          {loading ? (
            <div className={classes.container}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : emptyCheck !== 0 ? (
            shops?.map((doc, i) => (
              <div key={doc.shopName}>
                <ShopCardComponent doc={doc} malls={docs} />
              </div>
            ))
          ) : (
            <p className={classes.noRecords}>No shops added</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
