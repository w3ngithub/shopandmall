import "./page.css";
import React from "react";
import classes from "./mallform.module.css";

const Pagination = ({ mallsPerPage, docs, paginate }) => {
  const [activePage, setActivePage] = React.useState(1);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(docs / mallsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={classes.paginationContainer}>
      <ul className={classes.numbers}>
        {pageNumbers.map((number) => (
          <li
            className={activePage === number && "active"}
            key={number}
            onClick={() => {
              paginate(number);
              setActivePage(number);
            }}
          >
            {number}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
