import Slider from "react-slick";
import classes from "./shop.module.css";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SkeletonCard from "../../skeletons/SkeletonCard";
import ShopCardComponent from "../shopCardComponent/ShopCardComponent";

const Shop = ({ docs, settings, loading }) => {
  const [shops, setShops] = useState([]);

  const location = useLocation();

  let empty = docs.map((doc) => doc.shops);

  let emptyCheck = Math.max.apply(0, empty);

  useEffect(() => {
    let allShops = docs.map((doc) => doc.shops).flat();
    setShops(allShops);
  }, [docs]);

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
  console.log(sortedShops);
  return (
    <div>
      {location.pathname === "/" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname.split("/")[1] === "home" ||
      location.pathname.split("/")[2] === "category" ? (
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
            <p className={classes.noRecords}>No shops added</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
