import Logout from "./logout/Logout";
import React, { useState, useEffect } from "react";
import classes from "./Dashboard/dashboard.module.css";
import SwitchToUser from "./SwitchToUser/SwitchToUser.js";
import { withRouter } from "react-router-dom";

const Nav = (props) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);
  return (
    <nav className={classes.nav}>
      <div className={classes.userName}>{username.charAt(0).toUpperCase()}</div>
      <div className={classes.navButton}>
        <div
          className="cursor-pointer link-color flex"
          onClick={() => props.history.push("/admin/addshopcategories")}
        >
          <span> Add shop category</span>
        </div>

        <Logout />
        <SwitchToUser />
      </div>
    </nav>
  );
};

export default withRouter(Nav);
