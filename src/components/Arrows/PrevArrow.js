import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import classes from "./arrows.module.css";

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div className={`${classes.arrow} ${classes.left}`} onClick={onClick}>
      <IoIosArrowBack />
    </div>
  );
}

export default PrevArrow;
