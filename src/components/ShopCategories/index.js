import React, { useState } from "react";
import classes from "./shopCategories.module.css";
import { FaAngleDown, FaAngleUp, FaAngleRight } from "react-icons/fa";
import CategoryIcon from "../../assets/images/categoryIcon.svg";
import { useHistory, useLocation } from "react-router-dom";

const ShopCategories = ({
  isShopPage = false,
  shopCategory,
  showShopCategories,
  setShowShopCategories,
  setShowCategoryMobile,
}) => {
  const [hoverSubCategory, setHoverSubCategory] = useState({});
  const history = useHistory();

  const location = useLocation();
  const isAdmin = location.pathname.split("/").includes("admin");

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

  return (
    <div>
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
                  onClick={() =>
                    history.push(
                      isShopPage
                        ? isAdmin
                          ? "/admin/shops/category/" + shopCat.category
                          : "/shops/category/" + shopCat.category
                        : isAdmin
                        ? "/admin/malls/category/" + shopCat.category
                        : "/malls/category/" + shopCat.category
                    )
                  }
                  onMouseEnter={() => openSubCategory(shopCat.id)}
                  onMouseLeave={() => closeSubCategory(shopCat.id)}
                >
                  <p>
                    {shopCat.category}
                    <span className={classes.number}>
                      ({shopCat.rowContent.rowData.length})
                    </span>
                  </p>
                  {shopCat.rowContent.rowData.length !== 0 && <FaAngleRight />}
                </div>
                {hoverSubCategory[shopCat.id] && (
                  <div
                    className={classes.sideBlock}
                    onMouseEnter={() => openSubCategory(shopCat.id)}
                    onMouseLeave={() => closeSubCategory(shopCat.id)}
                  >
                    {shopCat.rowContent.rowData.map((row) => (
                      <p
                        key={row.id}
                        onClick={() =>
                          history.push(
                            isShopPage
                              ? isAdmin
                                ? `/admin/shops/category/${shopCat.category}/${row.subCategory}`
                                : `/shops/category/${shopCat.category}/${row.subCategory}`
                              : isAdmin
                              ? `/admin/malls/category/${shopCat.category}/${row.subCategory}`
                              : `/malls/category/${shopCat.category}/${row.subCategory}`
                          )
                        }
                      >
                        {row.subCategory}
                      </p>
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
    </div>
  );
};

export default ShopCategories;
