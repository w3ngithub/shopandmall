import React, { useState } from "react";
import classes from "./nav.module.css";
import Logo from "../../image/logo.png";
import useFirestore from "../../hooks/useFirestore";

import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import DefaultImage from "../../assets/images/defaultImage.png";

const NavBar = ({ check }) => {
  let { docs } = useFirestore("Shop Categories");

  const history = useHistory();
  const location = useLocation();

  const [checked, setChecked] = useState(false);

  const [_, setUserValidate] = useState(false);

  return (
    <div className={classes.navbar}>
      <div className={classes.container}>
        <div className={classes.logo}>
          <Link to="/" className={classes.logo2}>
            <img src={Logo} alt="" />
            <p>Shops and Malls</p>
          </Link>
        </div>
        <div className={classes.menuItems}>
          <div className={classes.menuList}>
            <ul>
              <li>
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

                <ul className={classes.shopsDropdown}>
                  <div className={classes.dropDownWrapper}>
                    {docs.map((doc) => (
                      <div className={classes.col} key={doc.category}>
                        <li className={classes.row}>
                          <h3
                            onClick={() =>
                              history.push(`/shops/${doc.category}`)
                            }
                          >
                            {doc.category}
                          </h3>
                          <FaAngleDown className={classes.headerIcon} />

                          <ul className={checked ? classes.drop : classes.hide}>
                            {doc.rowContent.rowData.map((row) => {
                              return (
                                <li
                                  key={row.id}
                                  onClick={() =>
                                    history.push(
                                      `/shops/${doc.category}/${row.subCategory}`
                                    )
                                  }
                                >
                                  {row.subCategory}
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      </div>
                    ))}
                  </div>
                </ul>
              </li>
              {check === "true" && (
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
