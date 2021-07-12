import React, { useState } from "react";
import classes from "./shopCategories.module.css";
import { FaAngleDown, FaAngleUp, FaAngleRight } from "react-icons/fa";
import CategoryIcon from "../../assets/images/categoryIcon.svg";
import { useHistory } from "react-router-dom";

const ShopCategories = ({
  shopCategory,
  showShopCategories,
  setShowShopCategories,
  setShowCategoryMobile,
}) => {
  const [hoverSubCategory, setHoverSubCategory] = useState({});
  const history = useHistory();

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
                    history.push("/shops/category/" + shopCat.category)
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
                            `/shops/category/${shopCat.category}/${row.subCategory}`
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
