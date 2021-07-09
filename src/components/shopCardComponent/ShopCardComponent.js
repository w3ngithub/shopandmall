import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import classes from "../styles/Card.module.css";

const Shop = ({ doc, malls }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname.split("/").includes("home") ? (
        <div
          className={classes.wrapper}
          onClick={() =>
            location.pathname.split("/")[1] === "admin"
              ? history.push(
                  "/admin/" + doc.mallName + "/shops/" + doc.shops[0].shopName
                )
              : history.push(doc.mallName + "/shops/" + doc.shops[0].shopName)
          }
        >
          <div className={classes.imageContainer}>
            {doc?.shops[0]?.shopImages && (
              <img
                className={classes.image}
                src={doc?.shops[0]?.shopImages[0]?.url}
                alt=""
              />
            )}
          </div>
          <div className={classes.shopDetail}>
            <p className={classes.title}>{doc?.shops[0]?.shopName}</p>
            <p className={classes.shopLoc}>(Inside {doc.mallName})</p>
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
                    <img
                      className={classes.image}
                      src={shop?.shopImages[0]?.url}
                      alt=""
                    />
                  )}
                </div>
                <div className={classes.mallDetail}>
                  <p className={classes.title}>{shop?.shopName}</p>
                  <p className={classes.shopLoc}>(Inside {doc?.mallName})</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
