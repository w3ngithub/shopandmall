import React, { useState, useEffect } from "react";
import classes from "./navbar.module.css";
import Logo from "../../image/logo.png";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { useHistory } from "react-router-dom";

const NavBar = () => {
  const history = useHistory();

  const [username, setUsername] = useState("");

  let check = localStorage.getItem("isAuth");
  console.log("check", check);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  return (
    <div className={classes.navbar}>
      <div className={classes.container}>
        <div className={classes.logo}>
          <img src={Logo} alt="" />
          <p>Shops and Malls</p>
        </div>
        <div className={classes.menuItems}>
          <div className={classes.menuList}>
            <ul>
              <li>
                <Link to="">Malls</Link>
              </li>
              <li>
                <Link to="">Shops</Link>
                <FaAngleRight className={classes.icon} />

                <div className={classes.shopsDropdown}>
                  <div className={classes.dropDownWrapper}>
                    <div className={classes.col}>
                      <h3>Accessories</h3>
                      <ul>
                        <li>Demin Bags</li>
                        <li>Levis</li>
                        <li>Sonam</li>
                        <li>Ktm City</li>
                      </ul>
                    </div>
                    <div className={classes.col}>
                      <h3>Limited Edition</h3>
                      <ul>
                        <li>Divine Glass</li>
                        <li>Oakley</li>
                        <li>Pepe Jeans</li>
                        <li>Remax</li>
                      </ul>
                    </div>
                    <div className={classes.col}>
                      <h3>DullaShoes</h3>
                      <ul>
                        <li>Shoe</li>
                        <li>Shoe</li>
                      </ul>
                    </div>
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
