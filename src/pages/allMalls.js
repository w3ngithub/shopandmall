import React, { useState, useEffect } from "react";
import Mall from "../components/mall/Mall";
import { BiSearchAlt2 } from "react-icons/bi";
import useFirestore from "../hooks/useFirestore";
import classes from "../styles/allMallsShops.module.css";
import { useHistory, useLocation } from "react-router-dom";

import ShopCategories from "../components/ShopCategories";

import MobileShopCategory from "../components/MobileShopCategory";
import { FaPlus } from "react-icons/fa";
import { useFilterMallAndShops } from "../hooks/useFilterMallAndShops";

// import Pagination from "../components/mall/Pagination";

const AllMalls = () => {
  const [showShopCategories, setShowShopCategories] = useState(false);
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);

  let { docs, loading } = useFirestore("Shopping Mall");
  const [malls, setMalls] = useState([]);

  //Pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const [mallsPerPage] = useState(3);

  // const indexOfLastMall = currentPage * mallsPerPage;
  // const indexOfFirstMall = indexOfLastMall - mallsPerPage;
  // const currentMalls = docs.slice(indexOfFirstMall, indexOfLastMall);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ------------

  const location = useLocation();
  const history = useHistory();

  let shopCategory = useFirestore("Shop Categories").docs;
  const isShopCategorySelected = location.pathname
    .split("/")
    .includes("category");
  const { filteredMalls } = useFilterMallAndShops(docs, isShopCategorySelected);

  const filter = (e) => {
    setMalls(
      filteredMalls.filter((doc) =>
        doc.mallName.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setMalls(filteredMalls);
  }, [filteredMalls]);

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
          {...{ isHome: false, shopCategory, setShowCategoryMobile }}
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
          placeholder="Search Malls..."
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

      <div className={classes.main}>
        <div>
          {location.pathname === "/admin/malls" && (
            <button
              className={classes.addBtn}
              onClick={() => history.push("/admin/newMall")}
            >
              Add New Mall
            </button>
          )}
        </div>
        <div>
          {location.pathname === "/admin/malls" && (
            <button
              className={classes.addBtnMobile}
              onClick={() => history.push("/admin/newMall")}
            >
              <FaPlus />
            </button>
          )}
        </div>

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

        <div className={classes.mallContainer}>
          <Mall docs={malls} loading={loading} />
        </div>
        {/* <Pagination
            mallsPerPage={mallsPerPage}
            docs={docs.length}
            paginate={paginate}
          /> */}
      </div>
    </>
  );
};

export default AllMalls;
