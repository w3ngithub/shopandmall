import React from "react";
import classes from "../styles/Card.module.css";
import { useHistory, useLocation } from "react-router-dom";

const Shop = ({ doc, malls, single }) => {
  const history = useHistory();
  const location = useLocation();
  let shops = window.innerWidth <= 424 ? doc?.shops?.slice(0, 3) : doc?.shops?.slice(0, 9);
  return (
    <div>
      {!single ? (
        location.pathname === "/" ||
        location.pathname === "/admin/dashboard" ||
        location.pathname.split("/")[1] === "home" ||
        location.pathname.split("/")[2] === "category" ? (
          <div
            className={classes.wrapper}
            onClick={() =>
              location.pathname.split("/")[1] === "admin"
                ? history.push(
                    "/admin/" + doc.mallName + "/shops/" + shops[0].shopName
                  )
                : history.push(
                    "/mall/" + doc.mallName + "/shops/" + shops[0].shopName
                  )
            }
          >
            <div className={classes.imageContainer}>
              {shops[0]?.shopImages && (
                <img
                  className={classes.image}
                  src={shops[0]?.shopImages[0]?.url}
                  alt=""
                />
              )}
            </div>
            <div className={classes.shopDetail}>
              <p
                className={classes.title}
                title={`${shops[0]?.shopName} | ${doc?.mallName}`}
              >
                {shops[0]?.shopName}
                <span className={classes.midLine}> | </span>
                (Inside {doc?.mallName})
              </p>
              <p className={classes.mallTime}>
                {shops[0]?.timings[0]?.openTime} -
                {shops[0]?.timings[0]?.closeTime}, +977-
                {shops[0]?.shopPhoneNumber}
              </p>
            </div>
          </div>
        ) : (
          <div className={classes.container}>
            {malls?.map((doc) =>
              shops.map((shop, ind) => (
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
                    {shops[0]?.shopImages && (
                      <img
                        className={classes.image}
                        src={shop?.shopImages[0]?.url}
                        alt=""
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
                    <img
                      className={classes.image}
                      src={shop?.shopImages[0]?.url}
                      alt=""
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
