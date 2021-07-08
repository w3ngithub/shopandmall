import React, { useState, useEffect } from "react";
import classes from "../styles/Card.module.css";
import { useHistory, useLocation } from "react-router-dom";

const Shop = ({ doc, docs, malls, isShopCategorySelected }) => {
  const history = useHistory();
  const location = useLocation();

  const [filteredMalls, setFilteredMalls] = useState([]);

  const handleFilterShops = () => {
    const selectedCategory = location.pathname.split("/")[3];
    const selectedSubCategory = location.pathname.split("/")[4];
    let filtering = [];

    malls.forEach((mall) => {
      const shopsWithTheCategory = mall.shops.filter(
        (shop) => shop.category === selectedCategory
      );
      const shopsWithTheCategoryAndSubCategory = mall.shops.filter(
        (shop) =>
          shop.category === selectedCategory &&
          shop.subCategory === selectedSubCategory
      );

      if (shopsWithTheCategory.length > 0 && !Boolean(selectedSubCategory)) {
        filtering = [...filtering, { ...mall, shops: shopsWithTheCategory }];
      }

      if (shopsWithTheCategoryAndSubCategory.length > 0) {
        filtering = [
          ...filtering,
          { ...mall, shops: shopsWithTheCategoryAndSubCategory },
        ];
      }
    });

    setFilteredMalls(filtering);
  };

  useEffect(() => {
    if (isShopCategorySelected) {
      handleFilterShops();
    } else {
      setFilteredMalls(malls);
    }
  }, [location.pathname, malls]);

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
          {docs?.map((doc, ind) =>
            doc?.shops?.map((shop, ind) => (
              <div
                key={ind}
                className={classes.wrapper2}
                onClick={() =>
                  location.pathname.split("/")[1] === "admin"
                    ? history.push(
                        "/admin/" + doc.mallName + "/shops/" + shop.shopName
                      )
                    : history.push(doc.mallName + "/shops/" + shop.shopName)
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
