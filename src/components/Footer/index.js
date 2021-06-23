import React from "react";
import classes from "./footer.module.css";
import { RiFacebookFill } from "react-icons/ri";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoLogoTwitter } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={classes.footer}>
      <div className={classes.socialMedia}>
        <RiFacebookFill className={classes.mediaIcon} />
        <AiOutlineInstagram className={classes.mediaIcon} />
        <IoLogoTwitter className={classes.mediaIcon} />
      </div>
      <p>4600 Pipalbot, Kalimati, Opposite of Nabil Bank</p>
      <p className={classes.phone}>+977 0000000000</p>
      <div className={classes.line}></div>
      <div className={classes.title}>
        <h3>
          <Link to="/about-us">ABOUT US</Link>
        </h3>
        <h3>
          <Link to="/contact-us">CONTACT US</Link>
        </h3>
      </div>

      <p className={classes.copyright}>
        ©2018-2021 Brookfield Properties Retail Inc. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
