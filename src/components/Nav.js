import Logout from "./logout/Logout";
import React, { useState, useEffect } from "react";
import classes from "./Dashboard/dashboard.module.css";
import SwitchToUser from "./SwitchToUser/SwitchToUser.js";

const Nav = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);
  return (
    <nav className={classes.nav}>
      <div className={classes.userName}>{username.charAt(0).toUpperCase()}</div>
      <div className={classes.navButton}>
        <Logout />
        <SwitchToUser />
      </div>
    </nav>
  );
};

export default Nav;
