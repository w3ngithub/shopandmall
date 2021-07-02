import React from "react";
import { IoIosArrowForward } from "react-icons/io";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div className={`arrow arrow-right ${props.className}`} onClick={onClick}>
      <IoIosArrowForward className="arrow-icon" />
    </div>
  );
}

export default NextArrow;
