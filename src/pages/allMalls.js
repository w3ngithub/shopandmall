import Mall from "../components/mall/Mall";
import React, { useState } from "react";
import Pagination from "../components/mall/Pagination";
import useFirestore from "../hooks/useFirestore";
import classes from "../styles/allMalls.module.css";
import { useHistory, useLocation } from "react-router-dom";

const AllMalls = () => {
  const [search, setSearch] = useState("");

  let { docs } = useFirestore("Shopping Mall");

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [mallsPerPage] = useState(3);

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

        <>
          <Mall docs={currentMalls} />
          <Pagination
            mallsPerPage={mallsPerPage}
            docs={docs.length}
            paginate={paginate}
          />
        </>
      </div>
    </div>
  );
};

export default AllMalls;
