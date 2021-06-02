import React from "react";
import classes from "./logout.module.css";
import { useHistory } from "react-router-dom";

const Logout = () => {
  const history = useHistory();

  return (
    <>
      <button
        className={classes.button}
        onClick={() => {
          localStorage.setItem("isAuth", "false");
          history.push("/");
        }}
      >
        Log out
      </button>
    </>
  );
};

export default Logout;
