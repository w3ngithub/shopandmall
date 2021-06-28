import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import classes from "./arrows.module.css";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div className={`${classes.arrow} ${classes.next}`} onClick={onClick}>
      <IoIosArrowForward />
    </div>
  );
}

export default NextArrow;
