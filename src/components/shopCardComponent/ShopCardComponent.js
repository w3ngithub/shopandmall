import React from "react";
import classes from "../styles/Card.module.css";
import { useHistory, useLocation } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NoImage from "../../image/Barline-Loading-Images-1.gif";

const Shop = ({ doc, malls, single }) => {
  const history = useHistory();
  const location = useLocation();

  console.log(doc)
  return (
    <div>
      {!single ? (
        location.pathname === "/" ||
        location.pathname === "/admin/dashboard" ||
        location.pathname.split("/")[1] === "home" ||
        location.pathname.split("/")[2] === "category" ? (
          <div
            className={classes.wrapper}
            onClick={() =>{
              location.pathname.split("/")[1] === "admin"
                ? history.push(
                    "/admin/mall/" + doc.mall.mallName + "/shops/" + doc.shops[0].shopName
                  )
                : history.push(
                    "/mall/" + doc.mall.mallName + "/shops/" + doc.shops[0].shopName
                  )
                }
            }
          >
            <div className={classes.imageContainer}>
              {doc?.shopImages && (
                // <img
                //   className={classes.image}
                //   src={doc?.shops[0]?.shopImages[0]?.url}
                //   alt=""
                // />
                <LazyLoadImage
                  alt="images"
                  height={180}
                  src={doc?.shopImages[0]?.url}
                  width="100%"
                  placeholderSrc={NoImage}
                  className={classes.image}
                  effect="blur"
                />
              )}
            </div>
            <div className={classes.shopDetail}>
              <p className={classes.title}>
                {doc?.shopName}
                <span className={classes.midLine}> | </span>
                (Inside {doc?.mall?.mallName})
              </p>
              <p className={classes.mallTime}>
                {doc?.timings[0]?.openTime} -
                {doc?.timings[0]?.closeTime}, +977-
                {doc?.shopPhoneNumber}
              </p>
            </div>
          </div>
        ) : (
          <div className={classes.container}>
            {malls?.map((doc) =>
              doc.shops.map((shop, ind) => (
                <div
                  key={ind}
                  className={classes.wrapper2}
                  onClick={() =>
                    location.pathname.split("/")[1] === "admin"
                      ? history.push(
                          "/admin/" + doc.mallName + "/shops/" + shop.shopName
                        )
                      : history.push(
                          "/" + doc.mallName + "/shops/" + shop.shopName
                        )
                  }
                >
                  <div className={classes.imageContainer}>
                    {doc?.shops[0]?.shopImages && (
                      // <img
                      //   className={classes.image}
                      //   src={shop?.shopImages[0]?.url}
                      //   alt=""
                      // />
                      <LazyLoadImage
                        alt="images"
                        height={180}
                        src={shop?.shopImages[0]?.url}
                        width="100%"
                        placeholderSrc={NoImage}
                        className={classes.image}
                        effect="blur"
                      />
                    )}
                  </div>
                  <div className={classes.mallDetail}>
                    <p className={classes.title}>
                      {shop?.shopName}
                      <span className={classes.midLine}> | </span>
                      (Inside {doc?.mallName})
                    </p>
                    <p className={classes.mallTime}>
                      {shop?.timings[0]?.openTime} -{" "}
                      {shop.timings[0]?.closeTime}, +977-
                      {shop.shopPhoneNumber}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      ) : (
        <div className={classes.container2}>
          {malls.shops &&
            malls?.shops.map((shop, ind) => (
              <div
                key={ind}
                className={classes.wrapper3}
                onClick={() =>
                  location.pathname.split("/")[1] === "admin"
                    ? history.push(
                        "/admin/" + malls.mallName + "/shops/" + shop.shopName
                      )
                    : history.push(
                        "/" + malls.mallName + "/shops/" + shop.shopName
                      )
                }
              >
                <div className={classes.imageContainer}>
                  {malls?.shops[0]?.shopImages && (
                    // <img
                    //   className={classes.image}
                    //   src={shop?.shopImages[0]?.url}
                    //   alt=""
                    // />
                    <LazyLoadImage
                      alt="images"
                      height={180}
                      src={shop?.shopImages[0]?.url}
                      width="100%"
                      placeholderSrc={NoImage}
                      className={classes.image}
                      effect="blur"
                    />
                  )}
                </div>
                <div className={classes.mallDetail}>
                  <p className={classes.title}>
                    {shop?.shopName}
                    <span className={classes.midLine}> | </span>
                    (Inside {malls?.mallName})
                  </p>
                  <p className={classes.mallTime}>
                    {shop?.timings[0]?.openTime} - {shop?.timings[0]?.closeTime}
                    , +977-
                    {shop.shopPhoneNumber}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
