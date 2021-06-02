import React from "react";
import { Link } from "react-router-dom";
import classes from "./switchToUser.module.css";

const SwitchToUser = () => {
  return (
    <div className={classes.link}>
      <button className={classes.button}>
        <Link to="/">Switch To User</Link>
      </button>
    </div>
  );
};

export default SwitchToUser;
