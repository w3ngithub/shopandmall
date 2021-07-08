import Shop from "../components/shop/Shop";
import Mall from "../components/mall/Mall";
import React, { useState, useEffect } from "react";
import classes from "../styles/dashboard.module.css";
import useFirestore from "../hooks/useFirestore";
import { useHistory, Link, useLocation } from "react-router-dom";
import HomepageImage from "../assets/images/homepage.png";
import ShopFilter from "../components/ShopFilter";
import { BiSearchAlt2 } from "react-icons/bi";

import MobileShopCategory from "../components/MobileShopCategory";

//Slick
import NextArrow from "../components/Arrows/NextArrow";
import PrevArrow from "../components/Arrows/PrevArrow";
import { useFilterMallAndShops } from "../hooks/useFilterMallAndShops";

const Dashboard = () => {
  const [malls, setMalls] = useState([]);
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);

  const history = useHistory();
  const location = useLocation();
  let { docs, loading } = useFirestore("Shopping Mall");

  const isShopCategorySelected = location.pathname
    .split("/")
    .includes("category");
  const { filteredMalls } = useFilterMallAndShops(docs, isShopCategorySelected);

  let shopCategory = useFirestore("Shop Categories").docs;

  const filter = (e) => {
    let docs1 = [];
    docs1 = filteredMalls.filter((doc) =>
      doc.mallName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setMalls(docs1);
  };

  useEffect(() => {
    setMalls(filteredMalls);
  }, [filteredMalls]);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
    useTransform: true,
  };

  return (
    <div>
      <div
        className={
          showCategoryMobile
            ? classes.showCategoryDropdown
            : classes.hideCategoryDropdown
        }
      >
        <MobileShopCategory {...{ shopCategory, setShowCategoryMobile }} />
      </div>

      <div className={classes.topImage}>
        <div className={classes.img}>
          <img src={HomepageImage} alt="" />
        </div>
        <div className={classes.text}>
          <h3>Search Shops and Malls</h3>
          <p>100+ shops</p>
        </div>

        <div className={classes.search}>
          <BiSearchAlt2 className={classes.icon} />
          <input
            className={classes.searchBar}
            onChange={filter}
            type="text"
            placeholder="Search Mall..."
          />
        </div>
      </div>

      <main className={classes.bodyWrapper}>
        {/* ------------ ShopFilter ------------ */}
        <ShopFilter {...{ setShowCategoryMobile, loading, shopCategory }} />

        <div className={classes.main}>
          {location.pathname === "/admin/dashboard" && (
            <button
              className={classes.addBtn}
              onClick={() =>
                history.push({
                  pathname: "/admin/newMall",
                })
              }
            >
              Add New Mall
            </button>
          )}

          <div className={classes.mallContainer}>
            <div className={classes.header}>
              <h4 className={classes.heading}>Malls</h4>
              {malls.length > 3 &&
                (location.pathname === "/admin/dashboard" ? (
                  <Link className={classes.view} to="/admin/malls">
                    View all
                  </Link>
                ) : (
                  <Link className={classes.view} to="/malls">
                    View all
                  </Link>
                ))}
            </div>
            <Mall docs={malls} settings={settings} loading={loading} />
          </div>

          {loading === false && docs.length === 0 ? null : (
            <div className={classes.mallContainer}>
              <div className={classes.header}>
                <h4 className={classes.heading}>Shops</h4>
                {malls.length > 3 &&
                  (location.pathname === "/admin/dashboard" ? (
                    <Link className={classes.view} to="/admin/shops">
                      View all
                    </Link>
                  ) : (
                    <Link className={classes.view} to="/shops">
                      View all
                    </Link>
                  ))}
              </div>
              <Shop docs={malls} settings={settings} loading={loading} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
