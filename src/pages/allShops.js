import Shop from "../components/shop/Shop";
import React, { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import classes from "../styles/allShops.module.css";
import { useHistory, useLocation } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";

const AllShops = () => {
  let { docs } = useFirestore("Shopping Mall");
  const [search, setSearch] = useState("");
  const location = useLocation();
  const history = useHistory();

  const filter = (e) => {
    setSearch(e.target.value);
  };

  if (search) {
    docs = docs?.map((doc) => {
      doc.shops = doc.shops.filter((shop) =>
        shop.shopName.toLowerCase().includes(search.toLowerCase())
      );
      return doc;
    });
  }

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
          <Shop {...{ docs }} />
        ) : (
          <h3>No Shops Added Yet</h3>
        )}
        <div className={classes.link}></div>
      </div>
    </div>
  );
};

export default AllShops;
