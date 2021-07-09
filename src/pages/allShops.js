import React, { useState } from "react";
import Shop from "../components/shop/Shop";
import { BiSearchAlt2 } from "react-icons/bi";
import useFirestore from "../hooks/useFirestore";
import classes from "../styles/allMallsShops.module.css";
import ShopCategories from "../components/ShopCategories";

import MobileShopCategory from "../components/MobileShopCategory";

const AllShops = () => {
  let { docs, loading } = useFirestore("Shopping Mall");
  let shopCategory = useFirestore("Shop Categories").docs;

  const [search, setSearch] = useState("");
  const [showShopCategories, setShowShopCategories] = useState(false);
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);

  const filter = (e) => {
    let filteredMalls = [];
    docs?.forEach((doc) => {
      const filterShops = [
        ...doc.shops.filter((shop) =>
          shop.shopName.toLowerCase().includes(e.target.value.toLowerCase())
        ),
      ];
      filteredMalls = [...filteredMalls, { ...doc, shops: filterShops }];
    });
    console.log(e.target.value);
    // setMalls(filteredMalls);
  };

  if (search) {
    docs = docs?.filter((doc) => {
      doc.shops = doc.shops.filter((shop) =>
        shop.shopName.toLowerCase().includes(search.toLowerCase())
      );
      return doc;
    });
  }

  return (
    <>
      <div
        className={
          showCategoryMobile
            ? classes.showCategoryDropdown
            : classes.hideCategoryDropdown
        }
      >
        <MobileShopCategory {...{ shopCategory, setShowCategoryMobile }} />
      </div>

      <div
        className={classes.search}
        onClick={() => setShowShopCategories(false)}
      >
        <BiSearchAlt2 className={classes.icon} />
        <input
          className={classes.searchBar}
          type="text"
          placeholder="Search Shops..."
          onChange={filter}
        />
      </div>

      <div
        onClick={() => setShowShopCategories(false)}
        style={{
          position: "absolute",
          height: "100vh",
          width: "100%",
          left: 0,
          top: 0,
        }}
      ></div>

      <div className={classes.mainShops}>
        <ShopCategories
          {...{
            shopCategory,
            showShopCategories,
            setShowShopCategories,
            setShowCategoryMobile,
          }}
        />

        <div
          onClick={() => setShowShopCategories(false)}
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
          }}
        ></div>

        <div className={classes.shopContainer}>
          <div className={classes.header}>
            <h4 className={classes.heading}>Shops</h4>
          </div>
          <Shop {...{ docs, loading }} />
        </div>
      </div>
    </>
  );
};

export default AllShops;
