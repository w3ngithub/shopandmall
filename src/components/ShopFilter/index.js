/* eslint-disable */
import classes from "./shopFilter.module.css";
import React, { useState, useEffect } from "react";
import SkeletonText from "../../skeletons/SkeletonText";
import CategoryIcon from "../../assets/images/categoryIcon.svg";
import { Link, useHistory, useLocation, NavLink } from "react-router-dom";

const ShopFilter = ({ setShowCategoryMobile, loading, shopCategory }) => {
  const [singleShopCategory, setSingleShopCategory] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const [current, setCurrent] = useState({ active: "" });

  const subCategoryId = (id, shopCat) => {
    setSingleShopCategory([shopCat]);
  };

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/admin/dashboard") {
      setSingleShopCategory([]);
    }
  }, [location.pathname]);

  const currentPage = (id) => {
    setCurrent({ active: id });
  };

  return (
    <div className={classes.shopFilter}>
      <h3>Shop Filters</h3>
      <p
        className={classes.categoryDesktop}
        onClick={() => {
          setSingleShopCategory([]);
          history.push(
            location.pathname.split("/")[1] === "admin"
              ? "/admin/dashboard"
              : "/"
          );
        }}
      >
        <img src={CategoryIcon} alt="" />
        All Categories
      </p>

      {/* ---------- Desktop ---------- */}
      <div className={classes.desktopShopFilter}>
        {loading
          ? [1, 2, 3].map((n) => <SkeletonText key={n} />)
          : singleShopCategory.length === 0
          ? shopCategory?.map((shopCat) => (
              <div key={shopCat.id}>
                <p
                  className={classes.categoryP}
                  onClick={() => {
                    subCategoryId(shopCat.id, shopCat);
                    history.push(
                      location.pathname.split("/")[1] === "admin"
                        ? // ? "/admin/category/" + shopCat.category
                          "/admin/home/category/" + shopCat.category
                        : "/home/category/" + shopCat.category
                    );
                  }}
                >
                  {shopCat.category}
                  <span className={classes.number}>
                    ({shopCat.rowContent.rowData.length})
                  </span>
                  <span className={classes.numberMob}>
                    {shopCat.rowContent.rowData.length}
                  </span>
                </p>
              </div>
            ))
          : singleShopCategory.map((s) => (
              <div key={s.id}>
                <p className={classes.categoryP}>
                  {s.category}
                  <span className={classes.number}>
                    ({s.rowContent.rowData.length})
                  </span>
                  <span className={classes.numberMob}>
                    {s.rowContent.rowData.length}
                  </span>
                </p>

                <div className={classes.subCategory}>
                  {s.rowContent.rowData.map((subCat) => (
                    <div key={subCat.id}>
                      <Link
                        to={
                          location.pathname.split("/")[1] === "admin"
                            ? // ? `/admin/category/${s.category}/${subCat.subCategory}`
                              `/admin/home/category/${s.category}/${subCat.subCategory}`
                            : `/home/category/${s.category}/${subCat.subCategory}`
                        }
                        onClick={() => currentPage(subCat.id)}
                        className={
                          current.active === subCat.id
                            ? classes.current
                            : classes.normal
                        }
                      >
                        <p>{subCat.subCategory}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
      </div>

      {/* ---------- Mobile ---------- */}
      <div className={classes.mobileShopFilter}>
        <p
          className={classes.categoryMobile}
          onClick={() => setShowCategoryMobile((prevState) => !prevState)}
        >
          <img src={CategoryIcon} alt="" />
          All Categories
        </p>
        {loading
          ? [1, 2, 3].map((n) => <SkeletonText key={n} />)
          : shopCategory?.slice(0, 3).map((shopCat) => (
              <p
                key={shopCat.id}
                onClick={() =>
                  history.push("/home/category/" + shopCat.category)
                }
              >
                <span className={classes.title}>{shopCat.category}</span>
                <span className={classes.number}>
                  ({shopCat.rowContent.rowData.length})
                </span>
                <span className={classes.numberMob}>
                  {shopCat.rowContent.rowData.length}
                </span>
              </p>
            ))}
      </div>
    </div>
  );
};

export default ShopFilter;
