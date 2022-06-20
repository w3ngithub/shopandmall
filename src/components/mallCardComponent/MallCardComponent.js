import React, { useState } from "react";
import classes from "../styles/Card.module.css";
import { IoMdCloseCircle } from "react-icons/io";
import NoImage from "../../image/Barline-Loading-Images-1.gif";
import { useHistory, useLocation } from "react-router-dom";
import { fireStore, storage } from "../../firebase/config";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DeleteModal from "../Modal/DeleteModal";

const MallCardComponent = ({ doc }) => {
  const history = useHistory();
  const location = useLocation();
  const [modal,setModal] = useState(false)

  const hanldeModal = ()=>{
    setModal(prev=>!prev)
  }

  return (
    <div
      className={
        location.pathname === "/" || location.pathname === "/admin/dashboard"
          ? classes.wrapper
          : classes.wrapper2
      }
      key={doc.id}
      onClick={() => {
        location.pathname.split("/")[1] === "admin"
          ? history.push("/admin/malls/" + doc.id.replace(" ", "_"))
          : history.push("/malls/" + doc.id.replace(" ", "_"));
      }}
    >
      {doc.mallImage ? (
        <div className={classes.imageContainer}>
          {(location.pathname ==="/admin/malls"||location.pathname ==="/admin/dashboard")  && (
            <div
              className={classes.closeIcon}
              onClick={(e) => {
                e.stopPropagation();
                hanldeModal()
              }}
            >
              <IoMdCloseCircle />
            </div>
          )}
          {modal && <DeleteModal datas={{hanldeModal,doc}}/>}
          <div>
            {/* <img
              className={classes.image}
              src={doc.mallImage.imageUrl}
              alt="images"
            /> */}
            <LazyLoadImage
              alt="images"
              height={180}
              src={doc.mallImage.imageUrl}
              width="100%"
              placeholderSrc={NoImage}
              className={classes.image}
              //effect="blur"
            />
          </div>
        </div>
      ) : (
        <div className={classes.imageContainer}>
          <img className={classes.image} src={NoImage} alt="images" />
        </div>
      )}
      <div className={classes.mallDetail}>
        <p
          className={classes.title}
          title={`${doc.mallName}|  ${doc.mallAddress}`}
        >
          {doc.mallName}
          <span className={classes.midLine}> | </span>
          {doc.mallAddress}
        </p>
        <p className={classes.mallTime}>
          {doc.timings[0].openTime} - {doc.timings[0].closeTime}, +977-
          {doc.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default MallCardComponent;
