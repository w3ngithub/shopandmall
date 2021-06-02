import Mall from "./Mall";
import Pagination from "./Pagination";
import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";
import classes from "../Dashboard/dashboard.module.css";
import { useHistory, useLocation } from "react-router-dom";

const AllMalls = () => {
  const [search, setSearch] = useState("");

  let { docs } = useFirestore("Shopping Mall");

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [mallsPerPage, setMallsPerPage] = useState(3);

  const indexOfLastMall = currentPage * mallsPerPage;
  const indexOfFirstMall = indexOfLastMall - mallsPerPage;
  const currentMalls = docs.slice(indexOfFirstMall, indexOfLastMall);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ------------

  const location = useLocation();
  const history = useHistory();

  const filter = (e) => {
    setSearch(e.target.value);
  };

  if (search) {
    docs = docs.filter((doc) =>
      doc.mallName.toLowerCase().includes(search.toLowerCase())
    );
  }
  return (
    <div className={classes.main}>
      {location.pathname === "/admin/malls" ? (
        <button
          className={classes.addBtn}
          onClick={() => history.push("/admin/newMall")}
        >
          Add New Mall
        </button>
      ) : (
        <div className={classes.search}>
          <input
            className={classes.searchBar}
            type="text"
            placeholder="Search..."
            onChange={filter}
          />
        </div>
      )}
      <div className={classes.mallContainer}>
        <div className={classes.header}>
          <h4 className={classes.heading}>Malls</h4>
        </div>
        {docs?.length !== 0 ? (
          // <Mall {...{ docs }} />
          <>
            <Mall docs={currentMalls} />
            <Pagination
              mallsPerPage={mallsPerPage}
              docs={docs.length}
              paginate={paginate}
            />
          </>
        ) : (
          <h3>No Malls Added Yet</h3>
        )}
      </div>
    </div>
  );
};

export default AllMalls;
