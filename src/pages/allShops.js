import React, { useState, useEffect } from "react";
import Shop from "../components/shop/Shop";
import { BiSearchAlt2 } from "react-icons/bi";
import useFirestore from "../hooks/useFirestore";
import { useFilterMallAndShops } from "../hooks/useFilterMallAndShops";
import classes from "../styles/allMallsShops.module.css";
import ShopCategories from "../components/ShopCategories";

import MobileShopCategory from "../components/MobileShopCategory";
import { useLocation, useHistory } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";

const AllShops = () => {
  let { docs, loading } = useFirestore("Shopping Mall");
  let shopCategory = useFirestore("Shop Categories").docs;
  const [search, setSearch] = useState("");
  const [showShopCategories, setShowShopCategories] = useState(false);
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);

  const location = useLocation();
  const [malls, setMalls] = useState([]);
  const history = useHistory();

  const isShopCategorySelected = location.pathname
    .split("/")
    .includes("category");
  const { filteredMalls } = useFilterMallAndShops(docs, isShopCategorySelected);

  const filter = (e) => {
    let filteredMalls2 = [];
    filteredMalls?.forEach((doc) => {
      const filterShops = [
        ...doc.shops.filter((shop) =>
          shop.shopName.toLowerCase().includes(e.target.value.toLowerCase())
        ),
      ];
      filteredMalls2 = [...filteredMalls2, { ...doc, shops: filterShops }];
    });

    setMalls(filteredMalls2);
  };

  useEffect(() => {
    setMalls(filteredMalls);
  }, [filteredMalls]);

  //show category list according to selected path
  let categoriesPath = null;
  const category = location.pathname.split("/")[3];
  const subCategory = location.pathname.split("/")[4];

  if (isShopCategorySelected) {
    categoriesPath = (
      <div className={classes.categoryLists}>
        {location.pathname.split("/").length === 4 ? (
          <>
            <p>{category}</p>
            <p
              className={classes.deleteicon}
              onClick={() => history.push("/shops")}
            >
              X
            </p>
          </>
        ) : (
          <>
            <p>{category}</p>
            <AiOutlineRight className={classes.righticon} />
            <p>{subCategory}</p>
            <p
              className={classes.deleteicon}
              onClick={() => history.push("/shops/category/" + category)}
            >
              X
            </p>
          </>
        )}
      </div>
    );
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
        <MobileShopCategory
          {...{
            isShopPage: true,
            isHome: false,
            shopCategory,
            setShowCategoryMobile,
          }}
        />
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
            isShopPage: true,
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
            {categoriesPath}
            <h4 className={classes.heading}>Shops</h4>
          </div>

          <Shop docs={malls} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default AllShops;
