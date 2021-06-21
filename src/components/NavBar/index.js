import React, { useState, useEffect } from "react";
import classes from "./navbar.module.css";
import Logo from "../../image/logo.png";
import { fireStore } from "../../firebase/config";
import useFirestore from "../../hooks/useFirestore";

import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

const NavBar = () => {
  let { docs } = useFirestore("Shop Categories");
  const history = useHistory();

  console.log("ssss", docs);

  const [username, setUsername] = useState("");
  const [showMobileNav, setShowMobileNav] = useState(false);

  let check = localStorage.getItem("isAuth");
  console.log("check", showMobileNav);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

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
                <Link to="">Malls</Link>
              </li>
              <li>
                <Link to="">Shops</Link>
                <FaAngleRight className={classes.icon} />

                <div className={classes.shopsDropdown}>
                  <div className={classes.dropDownWrapper}>
                    {docs.map((doc) => (
                      <div className={classes.col} key={doc.category}>
                        <h3>{doc.category}</h3>
                        <FaAngleRight className={classes.headerIcon} />
                        <ul>
                          {doc.rowContent.rowData.map((row) => (
                            <li
                              key={row.id}
                              onClick={() => setShowMobileNav(false)}
                            >
                              {row.subCategory}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* <div className={classes.col}>
                      <h3>Accessories</h3>
                      <FaAngleRight className={classes.headerIcon} />

                      <ul>
                        <li onClick={() => setShowMobileNav(false)}>
                          Demin Bags
                        </li>
                        <li>Levis</li>
                        <li>Sonam</li>
                        <li>Ktm City</li>
                      </ul>
                    </div>
                    <div className={classes.col}>
                      <h3>Limited Edition</h3>
                      <FaAngleRight className={classes.headerIcon} />

                      <ul>
                        <li>Divine Glass</li>
                        <li>Oakley</li>
                        <li>Pepe Jeans</li>
                        <li>Remax</li>
                      </ul>
                    </div>
                    <div className={classes.col}>
                      <h3>DullaShoes</h3>
                      <FaAngleRight className={classes.headerIcon} />

                      <ul>
                        <li>Shoe</li>
                        <li>Shoe</li>
                      </ul>
                    </div> */}
                  </div>
                </div>
              </li>
              <li>
                <Link to="">Shop Category</Link>
              </li>
              <li>
                <Link to="">About Us</Link>
              </li>
              <li>
                <Link to="">Contact Us</Link>
              </li>
            </ul>
          </div>

          {check === "true" ? (
            <>
              <div className={classes.user}>
                <div className={classes.userImage}>
                  <span>{username.charAt(0).toUpperCase()}</span>
                </div>
                <FaAngleRight className={classes.icon} />

                <div className={classes.userDropDown}>
                  <ul>
                    <li>
                      <Link to="/">
                        <div className={classes.list}>
                          <BiUserCircle className={classes.icons} />
                          Switch to user
                        </div>
                      </Link>
                    </li>
                    <li>
                      <div
                        className={classes.list}
                        onClick={() => {
                          localStorage.setItem("isAuth", "false");
                          history.push("/");
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
                    <li onClick={() => setShowMobileNav(false)}>
                      <Link to="/">
                        <div className={classes.list}>
                          <BiUserCircle className={classes.icons} />
                          Switch to user
                        </div>
                      </Link>
                    </li>
                    <li onClick={() => setShowMobileNav(false)}>
                      <div
                        className={classes.list}
                        onClick={() => {
                          localStorage.setItem("isAuth", "false");
                          history.push("/");
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
