import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/pageNotFound.module.css";

const PageNotFound = () => {
  return (
    <div className={styles.center}>
      <h1>404</h1>
      <h3>PAGE NOT FOUND</h3>
      <p>
        {localStorage.getItem("isAuth") === "false" ? (
          <Link to="/">Go To Homepage</Link>
        ) : (
          <Link to="/admin/dashboard">Go To Homepage</Link>
        )}
      </p>
    </div>
  );
};

export default PageNotFound;
