import { MyContext } from "../App";
import { Link } from "react-router-dom";
import Shop from "../components/shop/Shop";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import useFirestore from "../hooks/useFirestore";
import { HiChevronDoubleRight } from "react-icons/hi";
import classes from "../styles/allMallsShops.module.css";
import ShopCategories from "../components/ShopCategories";
import { useLocation, useHistory } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import MobileShopCategory from "../components/MobileShopCategory";
import { useFilterMallAndShops } from "../hooks/useFilterMallAndShops";

const AllShops = () => {
  let { docs, loading } = useFirestore("Shopping Mall");
  let shopCategory = useFirestore("Shop Categories").docs;
  const [showShopCategories, setShowShopCategories] = useState(false);
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);

  const location = useLocation();
  const [malls, setMalls] = useState([]);
  const [shops, setShops] = useState([]);
  const history = useHistory();

  const { showSearchExtended, setShowSearchExtended } = useContext(MyContext);

  const isAdmin = location.pathname.split("/").includes("admin");

  const isShopCategorySelected = location.pathname
    .split("/")
    .includes("category");
  const { filteredMalls } = useFilterMallAndShops(
    docs,
    isAdmin,
    isShopCategorySelected
  );

  const filter = (e) => {
    let filteredMalls2 = [];
    filteredMalls?.forEach((doc) => {
      const filterShops = [
        ...doc.shops.filter((shop) =>
          shop.shopName.toLowerCase().includes(e.target.value.toLowerCase())
        ),
      ];
      filteredMalls2 = [...filteredMalls2, { ...doc, shops: filterShops }];
    });

    setMalls(filteredMalls2);
  };

  useEffect(() => {
    setMalls(filteredMalls);
  }, [filteredMalls]);

  useEffect(() => {
    const shopCollection = malls
      .map((mall) =>
        mall.shops.map((shop) => ({ ...shop, mallName: mall.mallName }))
      )
      .flat();
    setShops(shopCollection);
  }, [malls]);

  //show category list according to selected path
  let categoriesPath = null;
  const category = isAdmin
    ? location.pathname.split("/")[4]
    : location.pathname.split("/")[3];
  const subCategory = isAdmin
    ? location.pathname.split("/")[5]
    : location.pathname.split("/")[4];

  if (isShopCategorySelected) {
    categoriesPath = !isAdmin ? (
      location.pathname.split("/").length === 4 ? (
        <>
          <p>{category}</p>
          <p
            className={classes.deleteicon}
            onClick={() => history.push("/shops")}
          >
            <IoCloseSharp className={classes.closeIcon} />
          </p>
        </>
      ) : (
        <>
          <p
            className={classes.mainParagraph}
            onClick={() => history.push("/shops/category/" + category)}
          >
            {category}
          </p>
          <HiChevronDoubleRight className={classes.righticon} />
          <p>{subCategory}</p>
          <p
            className={classes.deleteicon}
            onClick={() => history.push("/shops/category/" + category)}
          >
            <IoCloseSharp className={classes.closeIcon} />
          </p>
        </>
      )
    ) : location.pathname.split("/").length === 5 ? (
      <>
        <p>{category}</p>
        <p
          className={classes.deleteicon}
          onClick={() => history.push("/admin/shops")}
        >
          <IoCloseSharp className={classes.closeIcon} />
        </p>
      </>
    ) : (
      <>
        <p
          className={classes.mainParagraph}
          onClick={() => history.push("/admin/shops/category/" + category)}
        >
          {category}
        </p>
        <HiChevronDoubleRight className={classes.righticon} />
        <p>{subCategory}</p>
        <p
          className={classes.deleteicon}
          onClick={() => history.push("/admin/shops/category/" + category)}
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
          {...{
            isShopPage: true,
            isHome: false,
            shopCategory,
            setShowCategoryMobile,
          }}
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
          placeholder="Search Shops..."
          onChange={filter}
        />
      </div>

      {showSearchExtended && (
        <div className={classes.searchExtended}>
          <div className={classes.searchExtendedContainer}>
            <p>Quick Links</p>
            <div className={classes.searchExtendedMallNames}>
              {shops.slice(0, 4).map((shop) => (
                <Link
                  key={shop.shopName}
                  to={
                    location.pathname.split("/")[1] === "admin"
                      ? `/admin/${shop?.mallName.replace(" ", "_")}/shops/${
                          shop.shopName
                        }`
                      : `/${shop?.mallName.replace(" ", "_")}/shops/${
                          shop.shopName
                        }`
                  }
                >
                  {shop.shopName}
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

      <div
        className={
          isShopCategorySelected
            ? classes.mainShopsNotSelected
            : classes.mainShops
        }
      >
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
              isShopPage: true,
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
              ? classes.shopContainer
              : classes.shopContainer2
          }
          onClick={() => {
            setShowShopCategories(false);
            setShowSearchExtended(false);
          }}
        >
          <div className={classes.categoryLists}>{categoriesPath}</div>

          <div className={classes.header}>
            <h4 className={classes.heading}>Shops</h4>
          </div>
          {malls.length !== 0 ? (
            <Shop docs={malls} loading={loading} shops={shops} />
          ) : (
            <p className={classes.noRecords}>No Shops Found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AllShops;
