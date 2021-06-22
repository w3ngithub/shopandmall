import React, { useState } from "react";
import classes from "./navbar.module.css";
import Logo from "../../image/logo.png";
import useFirestore from "../../hooks/useFirestore";

import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import DefaultImage from "../../assets/images/defaultImage.png";

const NavBar = () => {
  let { docs } = useFirestore("Shop Categories");
  const history = useHistory();
  const location = useLocation();

  const [showMobileNav, setShowMobileNav] = useState(false);
  const [_, setUserValidate] = useState(false);

  let check = localStorage.getItem("isAuth");

  return (
    <div className={classes.navbar}>
      <div className={classes.container}>
        <div className={classes.logo}>
          <Link to="/" className={classes.logo}>
            <img src={Logo} alt="" />
            <p>Shops and Malls</p>
          </Link>

          {check === "false" && (
            <Link className={classes.signInBtn} to="/login">
              Sign In
            </Link>
          )}
          <span className={classes.burger}>
            {showMobileNav ? (
              <IoCloseSharp onClick={() => setShowMobileNav(false)} />
            ) : (
              <GiHamburgerMenu onClick={() => setShowMobileNav(true)} />
            )}
          </span>
        </div>
        <div
          className={`${classes.menuItems} ${
            showMobileNav ? classes.showSidebar : classes.check
          }`}
        >
          <div className={classes.menuList}>
            <ul>
              <li onClick={() => setShowMobileNav(false)}>
                <Link
                  to={
                    location.pathname.split("/")[1] === "admin"
                      ? "/admin/malls"
                      : "/malls"
                  }
                >
                  Malls
                </Link>
              </li>
              <li>
                <Link
                  to={
                    location.pathname.split("/")[1] === "admin"
                      ? "/admin/shops"
                      : "/shops"
                  }
                >
                  Shops
                </Link>
                <FaAngleDown className={classes.icon} />

                <div className={classes.shopsDropdown}>
                  <div className={classes.dropDownWrapper}>
                    {docs.map((doc) => (
                      <div className={classes.col} key={doc.category}>
                        <div className={classes.row}>
                          <h3>{doc.category}</h3>
                          <FaAngleDown className={classes.headerIcon} />
                        </div>
                        <ul>
                          {doc.rowContent.rowData.map((row) => {
                            return (
                              <li
                                key={row.id}
                                className={classes.row}
                                onClick={() => setShowMobileNav(false)}
                              >
                                {row.subCategory}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              {check === "true" && (
                <li>
                  <Link
                    to="/admin/addshopcategories"
                    onClick={() => setShowMobileNav(false)}
                  >
                    Shop Category
                  </Link>
                </li>
              )}
              <li className={classes.toHide}>
                <Link to="/about-us" onClick={() => setShowMobileNav(false)}>
                  About Us
                </Link>
              </li>
              <li className={classes.toHide}>
                <Link to="/contact-us" onClick={() => setShowMobileNav(false)}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {check === "true" ? (
            <>
              <div className={classes.user}>
                <div className={classes.userImage}>
                  <img src={DefaultImage} alt="" />
                </div>
                <FaAngleDown className={classes.icon} />

                <div className={classes.userDropDown}>
                  <ul>
                    <li>
                      {location.pathname.split("/")[1] === "admin" ? (
                        <Link to="/">
                          <div className={classes.list}>
                            <FaRegUserCircle className={classes.icons} />
                            Switch to user
                          </div>
                        </Link>
                      ) : (
                        <Link to="/admin/dashboard">
                          <div className={classes.list}>
                            <FaRegUserCircle className={classes.icons} />
                            Switch to admin
                          </div>
                        </Link>
                      )}
                    </li>
                    <li>
                      <div
                        className={classes.list}
                        onClick={() => {
                          localStorage.setItem("isAuth", "false");
                          history.push("/");
                          setUserValidate((prevState) => !prevState);
                        }}
                      >
                        <AiOutlineLogout className={classes.icons} />
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={classes.mobileUser}>
                <div className={classes.controller}>
                  <ul>
                    <li>
                      {location.pathname.split("/")[1] === "admin" ? (
                        <Link to="/">
                          <div
                            className={classes.list}
                            onClick={() => setShowMobileNav(false)}
                          >
                            <FaRegUserCircle className={classes.icons} />
                            Switch to user
                          </div>
                        </Link>
                      ) : (
                        <Link to="/admin/dashboard">
                          <div
                            className={classes.list}
                            onClick={() => setShowMobileNav(false)}
                          >
                            <FaRegUserCircle className={classes.icons} />
                            Switch to admin
                          </div>
                        </Link>
                      )}
                    </li>
                    <li onClick={() => setShowMobileNav(false)}>
                      <div
                        className={classes.list}
                        onClick={() => {
                          localStorage.setItem("isAuth", "false");
                          history.push("/");
                          setUserValidate((prevState) => !prevState);
                          setShowMobileNav(false);
                        }}
                      >
                        <AiOutlineLogout className={classes.icons} />
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <Link className={classes.button} to="/login">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
