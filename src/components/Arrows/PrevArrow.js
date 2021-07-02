import React from "react";
import { IoIosArrowBack } from "react-icons/io";

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div className={`arrow arrow-left ${props.className}`} onClick={onClick}>
      <IoIosArrowBack className="arrow-icon" />
    </div>
  );
}

export default PrevArrow;
