import Shop from "../components/shop/Shop";
import Mall from "../components/mall/Mall";
import React, { useState } from "react";
import classes from "../styles/dashboard.module.css";
import useFirestore from "../hooks/useFirestore";
import { useHistory, Link, useLocation } from "react-router-dom";
import HomepageImage from "../assets/images/homepage.png";

import { BiSearchAlt2 } from "react-icons/bi";

//Slick
import NextArrow from "../components/Arrows/NextArrow";
import PrevArrow from "../components/Arrows/PrevArrow";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const history = useHistory();
  const location = useLocation();
  let { docs } = useFirestore("Shopping Mall");

  let shopCategory = useFirestore("Shop Categories").docs;

  console.log("check", shopCategory);

  const filter = (e) => {
    setSearch(e.target.value);
  };

  if (search) {
    docs = docs.filter((doc) =>
      doc.mallName.toLowerCase().includes(search.toLowerCase())
    );
  }

  console.log("asdf", docs);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
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
        <div className={classes.shopFilter}>
          <h3>Shop Filters</h3>
          {shopCategory?.map((shopCat) => (
            <p key={shopCat.id}>
              {shopCat.category}({shopCat.rowContent.rowData.length})
            </p>
          ))}
        </div>

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
              {docs.length > 3 &&
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
            <Mall {...{ docs, settings }} />
          </div>

          <div className={classes.mallContainer}>
            <div className={classes.header}>
              <h4 className={classes.heading}>Shops</h4>
              {docs.length > 3 &&
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

            <Shop {...{ docs, settings }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
