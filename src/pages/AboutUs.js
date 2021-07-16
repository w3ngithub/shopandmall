import React from "react";
import Image from "../assets/images/aboutUs.svg";
import classes from "../styles/aboutUs.module.css";

const AboutUs = () => {
  return (
    <div className={classes.aboutUsContainer}>
      <div className={classes.aboutUsWrapper}>
        <h2>Who we are</h2>
        <div className={classes.text}>
          <p>
            We are a group of creative people, regular shoppers and developers
            who love to help others.
            <br />
            <br /> We all love shopping now and then but finding the right Shops
            for the quality product can be haunting sometimes. Especially in
            this modern world where we have lots of Malls for an option.
            <br />
            <br /> We created this website in the hope to help people easily
            find their perfect shops and malls just with their mobile phone
            without really going to visit the malls for finding the one shop you
            need.
          </p>

          <h3>Our mission is to build software that makes shopping easier</h3>
        </div>

        <img src={Image} alt="image" />
      </div>
    </div>
  );
};

export default AboutUs;
