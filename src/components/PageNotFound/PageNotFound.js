import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <h3>PAGE NOT FOUND</h3>
      <p>
        Go To Homepage<Link to="/">-&gt;</Link>
      </p>
    </div>
  );
};

export default PageNotFound;
