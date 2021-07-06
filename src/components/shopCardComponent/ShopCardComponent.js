import React from "react";
import classes from "./shopCardComponent.module.css";
import { useHistory, useLocation } from "react-router-dom";

const Shop = ({ doc, docs }) => {
  const history = useHistory();
  const location = useLocation();

  console.log(doc);
  console.log(docs);

  return (
    <div>
      {location.pathname === "/" || location.pathname === "/admin/dashboard" ? (
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
          {docs?.map((doc) =>
            doc.shops.map((shop, ind) => (
              <div
                key={ind}
                className={classes.wrapper}
                onClick={() =>
                  location.pathname.split("/")[1] === "admin"
                    ? history.push(
                        "/admin/" + doc.mallName + "/shops/" + shop.shopName
                      )
                    : history.push(doc.mallName + "/shops/" + shop.shopName)
                }
              >
                <div className={classes.imageContainer}>
                  {doc.shops[0].shopImages && (
                    <img
                      className={classes.image}
                      src={shop?.shopImages[0]?.url}
                      alt=""
                    />
                  )}
                </div>
                <div className={classes.mallDetail}>
                  <p className={classes.title}>{shop.shopName}</p>
                  <p className={classes.shopLoc}>(Inside {doc.mallName})</p>
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
