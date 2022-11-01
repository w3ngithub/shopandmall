import { Link } from "react-router-dom";
import Logo from "../../image/logo.svg";
import LogoText from "../../image/logoText.svg";
import classes from "./drawer.module.css";
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { FaAngleDown } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineLogout } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";

const Drawer = ({ check, data, setShowSearchExtended }) => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [openDD, setOpenDD] = useState({});
  const [_, setUserValidate] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    data.forEach((d) => {
      setOpenDD({
        ...openDD,
        [d.id]: false,
      });
    });
  }, [data]);

  const childNodeId = (id) => {
    setOpenDD({
      ...openDD,
      [id]: !openDD[id],
    });
  };

  return (
    <>
      <div
        className={classes.mobileNav}
        onClick={() => setShowSearchExtended(false)}
      >
        <div className={classes.logo}>
          <Link
            to={
              location.pathname.split("/")[1] === "admin"
                ? "/admin/dashboard"
                : "/"
            }
            className={classes.logo + " flex"}
          >
            <img src={Logo} alt="" />
            <img
              src={LogoText}
              alt=""
              style={{ width: "100px", marginLeft: "10px" }}
            />
          </Link>
        </div>
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
        className={
          showMobileNav ? classes.mobileContainer : classes.hideContainer
        }
      >
        <div className={classes.wrapper}>
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
            <li
              className={classes.sideWise}
              onClick={() => {
                history.push(
                  location.pathname.split("/")[1] === "admin"
                    ? "/admin/shops"
                    : "/shops"
                );
                setDropdown((prevState) => !prevState);
              }}
            >
              Shops
              {data.length > 0 && <FaAngleDown className={classes.icon} />}
            </li>
            {dropdown && (
              <ul>
                {data.map((d) => (
                  <div key={d.id}>
                    <li
                      className={classes.sideWise}
                      onClick={() => {
                        childNodeId(d.id);
                      }}
                    >
                      {d.category}
                      <FaAngleDown className={classes.icon} />
                    </li>
                    {openDD[d.id] && (
                      <ul>
                        {d.data.map((sub) => (
                          <li
                            key={sub + Math.random()}
                            onClick={() => setShowMobileNav(false)}
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ul>
            )}
            {check === "true" && location.pathname.split("/")[1] === "admin" && (
              <li>
                <Link to="/admin/addshopcategories">Shop Category</Link>
              </li>
            )}
            <li className={classes.toHide}>
              <Link to="/about-us">About Us</Link>
            </li>
            <li className={classes.toHide}>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
        {check === "true" && (
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
        )}
      </div>
    </>
  );
};

export default Drawer;
