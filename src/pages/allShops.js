import React, { useState } from "react";
import Shop from "../components/shop/Shop";
import { BiSearchAlt2 } from "react-icons/bi";
import useFirestore from "../hooks/useFirestore";
import classes from "../styles/allMallsShops.module.css";

const AllShops = () => {
  let { docs, loading } = useFirestore("Shopping Mall");
  const [search, setSearch] = useState("");

  const filter = (e) => {
    setSearch(e.target.value);
  };

  if (search) {
    docs = docs?.filter((doc) => {
      doc.shops = doc.shops.filter((shop) =>
        shop.shopName.toLowerCase().includes(search.toLowerCase())
      );
      return doc;
    });
  }

  // if (search) {
  //   docs = docs.filter((doc) =>
  //     doc.shops.map((shop) =>
  //       shop.shopName.toLowerCase().includes(search.toLowerCase())
  //     )
  //   );
  // }

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
