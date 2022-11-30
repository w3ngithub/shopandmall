import React from "react";
import { Redirect, Route } from "react-router-dom";

const index = ({ component: Component, page, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          localStorage.getItem("isAuth") === "true" ||
          localStorage.getItem("isAuth") === "user"
        ) {
          return <Component />;
        } else {
          return (
            <Redirect
              to={{ pathname: page, state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default index;
