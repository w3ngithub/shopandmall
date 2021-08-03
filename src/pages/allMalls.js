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
import { HiChevronDoubleRight } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";

import { Link } from "react-router-dom";

// import Pagination from "../components/mall/Pagination";

const AllMalls = () => {
  const [showShopCategories, setShowShopCategories] = useState(false);
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);
  const [showSearchExtended, setShowSearchExtended] = useState(false);

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

  //show category list according to selected path
  let categoriesPath = null;
  const category = location.pathname.split("/")[3];
  const subCategory = location.pathname.split("/")[4];

  if (isShopCategorySelected) {
    categoriesPath =
      location.pathname.split("/").length === 4 ? (
        <>
          <p>{category}</p>
          <p
            className={classes.deleteicon}
            onClick={() => history.push("/malls")}
          >
            <IoCloseSharp className={classes.closeIcon} />
          </p>
        </>
      ) : (
        <>
          <p
            className={classes.mainParagraph}
            onClick={() => history.push("/malls/category/" + category)}
          >
            {category}
          </p>
          <HiChevronDoubleRight className={classes.righticon} />
          <p>{subCategory}</p>
          <p
            className={classes.deleteicon}
            onClick={() => history.push("/malls/category/" + category)}
          >
            <IoCloseSharp className={classes.closeIcon} />
          </p>
        </>
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
          {...{ isHome: false, shopCategory, setShowCategoryMobile }}
        />
      </div>
      <div
        className={classes.search}
        onClick={() => {
          setShowShopCategories(false);
          setShowSearchExtended(true);
        }}
      >
        <BiSearchAlt2 className={classes.icon} />
        <input
          className={classes.searchBar}
          type="text"
          placeholder="Search Malls..."
          onChange={filter}
        />
      </div>

      {showSearchExtended && (
        <div className={classes.searchExtended}>
          <div className={classes.searchExtendedContainer}>
            <p>Quick Links</p>
            <div className={classes.searchExtendedMallNames}>
              {malls?.map((mall) => (
                <Link
                  key={mall.mallName}
                  to={
                    location.pathname.split("/")[1] === "admin"
                      ? `/admin/malls/${mall?.mallName.replace(" ", "_")}`
                      : `/malls/${mall?.mallName.replace(" ", "_")}`
                  }
                >
                  {mall.mallName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        onClick={() => {
          setShowShopCategories(false);
          setShowSearchExtended(false);
        }}
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

        <div
          className={
            isShopCategorySelected
              ? classes.shopCategories
              : classes.shopCategories2
          }
          onClick={() => setShowSearchExtended(false)}
        >
          <ShopCategories
            {...{
              shopCategory,
              showShopCategories,
              setShowShopCategories,
              setShowCategoryMobile,
            }}
          />
        </div>

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

        <div
          className={
            isShopCategorySelected
              ? classes.mallContainer
              : classes.mallContainer2
          }
          onClick={() => {
            setShowShopCategories(false);
            setShowSearchExtended(false);
          }}
        >
          <div className={classes.categoryLists}>{categoriesPath}</div>
          <div className={classes.header}>
            <h4 className={classes.heading}>Malls</h4>
          </div>
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
