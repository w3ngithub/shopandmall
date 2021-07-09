import React, { useState, useEffect } from "react";
import Shop from "../components/shop/Shop";
import { BiSearchAlt2 } from "react-icons/bi";
import useFirestore from "../hooks/useFirestore";
import { useFilterMallAndShops } from "../hooks/useFilterMallAndShops";
import classes from "../styles/allMallsShops.module.css";
import { useLocation, useHistory } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";

const AllShops = () => {
  let { docs, loading } = useFirestore("Shopping Mall");
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
      <div className={classes.search}>
        <BiSearchAlt2 className={classes.icon} />
        <input
          className={classes.searchBar}
          type="text"
          placeholder="Search Shops..."
          onChange={filter}
        />
      </div>

      <div className={classes.mainShops}>
        <div className={classes.shopContainer}>
          {categoriesPath}
          <div className={classes.header}>
            <h4 className={classes.heading}>Shops</h4>
          </div>

          <Shop docs={malls} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default AllShops;
