import Shop from "../components/shop/Shop";
import React, { useState, useEffect } from "react";
import useFirestore from "../hooks/useFirestore";
import classes from "../styles/allShops.module.css";
import { useHistory, useLocation } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";

const AllShops = () => {
  let { docs } = useFirestore("Shopping Mall");
  const [malls, setMalls] = useState("");
  const location = useLocation();
  const history = useHistory();

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
    setMalls(filteredMalls);
  };

  useEffect(() => {
    setMalls(docs);
  }, [docs]);

  //show category list according to selected path
  let categoriesPath = null;
  const category = location.pathname.split("/")[3];
  const subCategory = location.pathname.split("/")[4];
  const isShopCategorySelected = location.pathname
    .split("/")
    .includes("category");

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
    <div className={classes.main}>
      <div className={classes.mallContainer}>
        <div className={classes.search}>
          <input
            className={classes.searchBar}
            type="text"
            placeholder="Search..."
            onChange={filter}
          />
        </div>
        {categoriesPath}
        <div className={classes.header}>
          <h4 className={classes.heading}>Shops</h4>
        </div>
        {docs?.length !== 0 ? (
          <Shop docs={malls} isShopCategorySelected={isShopCategorySelected} />
        ) : (
          <h3>No Shops Added Yet</h3>
        )}
        <div className={classes.link}></div>
      </div>
    </div>
  );
};

export default AllShops;
