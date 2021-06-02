import Shop from "./Shop";
import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";
import classes from "../Dashboard/dashboard.module.css";

const AllShops = () => {
  let { docs } = useFirestore("Shopping Mall");
  const [search, setSearch] = useState("");

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
