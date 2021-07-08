import React, { useState } from "react";
import { Link } from "react-router-dom";
import SkeletonText from "../../skeletons/SkeletonText";
import CategoryIcon from "../../assets/images/categoryIcon.svg";
import classes from "./shopFilter.module.css";

const ShopFilter = ({ setShowCategoryMobile, loading, shopCategory }) => {
  const [singleShopCategory, setSingleShopCategory] = useState([]);

  const subCategoryId = (id, shopCat) => {
    setSingleShopCategory([shopCat]);
  };

  return (
    <div className={classes.shopFilter}>
      <h3>Shop Filters</h3>
      <p
        className={classes.categoryDesktop}
        onClick={() => setSingleShopCategory([])}
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
                <p onClick={() => subCategoryId(shopCat.id, shopCat)}>
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
                <p>
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
                      <Link to="/">
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
              <p key={shopCat.id}>
                {shopCat.category}
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
