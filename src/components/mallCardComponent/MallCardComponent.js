import React from "react";
import classes from "../styles/Card.module.css";
import { IoMdCloseCircle } from "react-icons/io";
import NoImage from "../../image/Barline-Loading-Images-1.gif";
import { useHistory, useLocation } from "react-router-dom";
import { fireStore, storage } from "../../firebase/config";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MallCardComponent = ({ doc }) => {
  const history = useHistory();
  const location = useLocation();

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
          {location.pathname === "/admin/dashboard" && (
            <div
              className={classes.closeIcon}
              onClick={(e) => {
                e.stopPropagation();

                let storageRef = storage.ref();
                let mallImageDel = storageRef.child(doc.mallImage.imageName);

                //Shop Images
                doc.shops.map((shop) =>
                  shop.shopImages.map((s) =>
                    storageRef
                      .child(s.id)
                      .delete()
                      .then(() => "Images Deleted SuccessFUlly")
                      .catch((err) => "Images Not Deleted")
                  )
                );

                //Deleting Images
                mallImageDel
                  .delete()
                  .then(() => "Images Deleted SuccessFUlly")
                  .catch((err) => "Images Not Deleted");

                //shop video
                doc.shops.forEach((shop) => {
                  if (shop.shopVideo) {
                    storageRef
                      .child(shop.shopVideo.id)
                      .delete()
                      .then(() => console.log("deleted video"));
                  }
                });
                //video thumbnail
                doc.shops.forEach((shop) => {
                  if (shop.shopVideo) {
                    storageRef
                      .child(shop.shopVideo.thumbnail.id)
                      .delete()
                      .then(() => console.log("deleted Thumbnail"));
                  }
                });
                fireStore
                  .collection("Shopping Mall")
                  .doc(doc.mallName)
                  .delete()
                  .then(() => console.log("DELETED Successfully"))
                  .catch((error) => console.log("Error deleting mall"));
              }}
            >
              <IoMdCloseCircle />
            </div>
          )}
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
