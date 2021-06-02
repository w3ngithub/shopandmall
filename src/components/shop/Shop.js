import React from "react";
import classes from "../Dashboard/dashboard.module.css";
import NoImage from "../../image/No_Image_Available.jpg";
import { useHistory, useLocation } from "react-router-dom";

const Shop = ({ docs }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div className={classes.container}>
      {location.pathname === "/admin/dashboard" || location.pathname === "/"
        ? docs?.slice(0, 3).map((doc, i) => (
            <div
              className={classes.wrapper}
              key={i}
              onClick={() =>
                location.pathname.split("/")[1] === "admin"
                  ? history.push(
                      "/admin/" +
                        doc.mallName +
                        "/shops/" +
                        doc.shops[0].shopName
                    )
                  : history.push(
                      doc.mallName + "/shops/" + doc.shops[0].shopName
                    )
              }
            >
              {doc?.hasOwnProperty("shops") ? (
                <>
                  <div className={classes.imageContainer}>
                    {doc.shops.length > 0 && doc.shops[0].shopImages && (
                      <img
                        src={
                          doc?.shops[0]
                            ? doc?.shops[0]?.shopImages[0]?.url
                            : NoImage
                        }
                        alt="shopImages"
                        className={classes.image}
                      />
                    )}
                  </div>

                  <p className={classes.title}>{doc?.shops[0]?.shopName}</p>
                </>
              ) : null}
              <p>( Inside {doc.mallName})</p>
            </div>
          ))
        : docs.map((doc, i) =>
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
                      src={shop.shopImages[0].url}
                      alt=""
                    />
                  )}
                </div>
                <p className={classes.title}>{shop.shopName}</p>
                <p>(Inside {doc.mallName})</p>
              </div>
            ))
          )}
    </div>
  );
};

export default Shop;
