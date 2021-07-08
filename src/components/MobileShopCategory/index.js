import React, { useState } from "react";
import classes from "./mobileShopCategory.module.css";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";

const MobileShopCategory = ({ shopCategory, setShowCategoryMobile }) => {
  const [openDD, setOpenDD] = useState({});

  const childNodeId = (id) => {
    setOpenDD({
      ...openDD,
      [id]: !openDD[id],
    });
  };

  return (
    <div className={classes.dropdown}>
      <div className={classes.header}>
        Filter by Category
        <IoCloseSharp onClick={() => setShowCategoryMobile(false)} />
      </div>

      {shopCategory?.map((shopCat) => (
        <div key={shopCat.id}>
          <div
            onClick={() => {
              childNodeId(shopCat.id);
            }}
          >
            <p className={classes.name}>
              {shopCat.category}
              <span className={classes.number}>
                ({shopCat.rowContent.rowData.length})
              </span>
            </p>
          </div>
          {openDD[shopCat.id] && (
            <div className={classes.subCategory}>
              {shopCat.rowContent.rowData.map((subCat) => (
                <div key={subCat.id}>
                  <Link to="/" onClick={() => setShowCategoryMobile(false)}>
                    <p className={classes.paragraph}>{subCat.subCategory}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileShopCategory;
