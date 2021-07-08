import React, { useState } from "react";
import Mall from "../components/mall/Mall";
import { BiSearchAlt2 } from "react-icons/bi";
import useFirestore from "../hooks/useFirestore";
import classes from "../styles/allMallsShops.module.css";
import { useHistory, useLocation } from "react-router-dom";
import CategoryIcon from "../assets/images/categoryIcon.svg";
import { FaAngleDown, FaAngleUp, FaAngleRight } from "react-icons/fa";

import MobileShopCategory from "../components/MobileShopCategory";
import { FaPlus } from "react-icons/fa";

// import Pagination from "../components/mall/Pagination";

const AllMalls = () => {
  const [search, setSearch] = useState("");
  const [showShopCategories, setShowShopCategories] = useState(false);
  const [hoverSubCategory, setHoverSubCategory] = useState({});
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);

  let { docs, loading } = useFirestore("Shopping Mall");

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

  const filter = (e) => {
    setSearch(e.target.value);
  };

  const openSubCategory = (id) => {
    setHoverSubCategory({
      ...!hoverSubCategory,
      [id]: true,
    });
  };

  const closeSubCategory = (id) => {
    setHoverSubCategory({
      ...hoverSubCategory,
      [id]: false,
    });
  };

  if (search) {
    docs = docs.filter((doc) =>
      doc.mallName.toLowerCase().includes(search.toLowerCase())
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
        <MobileShopCategory {...{ shopCategory, setShowCategoryMobile }} />
      </div>
      <div className={classes.search}>
        <BiSearchAlt2 className={classes.icon} />
        <input
          className={classes.searchBar}
          type="text"
          placeholder="Search Malls..."
          onChange={filter}
        />
      </div>
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

        {/* --------------- Shop Category Desktop --------------- */}

        <div className={`${classes.shopCategories} ${classes.desktop}`}>
          <p
            className={classes.title}
            onClick={() => setShowShopCategories((prevState) => !prevState)}
          >
            <span>
              <img src={CategoryIcon} alt="" /> Shop Categories
            </span>
            {showShopCategories ? (
              <FaAngleUp className={classes.downIcon} />
            ) : (
              <FaAngleDown className={classes.downIcon} />
            )}
          </p>

          {showShopCategories && (
            <div className={classes.allCategories}>
              {shopCategory?.map((shopCat) => (
                <div key={shopCat.id}>
                  <div
                    className={classes.category}
                    onMouseEnter={() => openSubCategory(shopCat.id)}
                    onMouseLeave={() => closeSubCategory(shopCat.id)}
                  >
                    <p>
                      {shopCat.category}
                      <span className={classes.number}>
                        ({shopCat.rowContent.rowData.length})
                      </span>
                    </p>
                    {shopCat.rowContent.rowData.length !== 0 && (
                      <FaAngleRight />
                    )}
                  </div>
                  {hoverSubCategory[shopCat.id] && (
                    <div
                      className={classes.sideBlock}
                      onMouseEnter={() => openSubCategory(shopCat.id)}
                      onMouseLeave={() => closeSubCategory(shopCat.id)}
                    >
                      {shopCat.rowContent.rowData.map((row) => (
                        <p key={row.id}>{row.subCategory}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --------------- Shop Category Mobile --------------- */}

        <div
          className={`${classes.shopCategories} ${classes.mobile}`}
          onClick={() => setShowCategoryMobile((prevState) => !prevState)}
        >
          <p className={classes.title}>
            <span>
              <img src={CategoryIcon} alt="" /> Shop Categories
            </span>
          </p>
        </div>

        <div className={classes.mallContainer}>
          <Mall docs={docs} loading={loading} />
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
