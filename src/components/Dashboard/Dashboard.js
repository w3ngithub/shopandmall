import Shop from "../shop/Shop";
import Mall from "../mall/Mall";
import React, { useState } from "react";
import classes from "./dashboard.module.css";
import useFirestore from "../../hooks/useFirestore";
import { useHistory, Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const history = useHistory();
  const location = useLocation();
  let { docs } = useFirestore("Shopping Mall");

  const filter = (e) => {
    setSearch(e.target.value);
  };

  if (search) {
    docs = docs.filter((doc) =>
      doc.mallName.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div>
      <main className={classes.main}>
        {location.pathname === "/admin/dashboard" ? (
          <button
            className={classes.addBtn}
            onClick={() =>
              history.push({
                pathname: "/admin/newMall",
              })
            }
          >
            Add New Mall
          </button>
        ) : (
          <div className={classes.search}>
            <input
              className={classes.searchBar}
              onChange={filter}
              type="text"
              placeholder="Search Mall..."
            />
          </div>
        )}

        <div className={classes.mallContainer}>
          <div className={classes.header}>
            <h4 className={classes.heading}>Malls</h4>
          </div>
          <Mall {...{ docs }} />

          {docs.length > 3 &&
            (location.pathname === "/admin/dashboard" ? (
              <Link className={classes.view} to="/admin/malls">
                View all
              </Link>
            ) : (
              <Link className={classes.view} to="/malls">
                VIEW all
              </Link>
            ))}
        </div>

        <div className={classes.mallContainer}>
          <div className={classes.header}>
            <h4 className={classes.heading}>Shops</h4>
          </div>
          <Shop {...{ docs }} />
          <div className={classes.link}>
            {docs.length > 3 &&
              (location.pathname === "/admin/dashboard" ? (
                <Link className={classes.view} to="/admin/shops">
                  View all
                </Link>
              ) : (
                <Link className={classes.view} to="/shops">
                  View all
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
