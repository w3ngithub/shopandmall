import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import classes from "../styles/Card.module.css";
import NoImage from "../../image/No_Image_Available.jpg";
import { useHistory, useLocation } from "react-router-dom";
import { fireStore, storage } from "../../firebase/config";

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
                fireStore
                  .collection("Shopping Mall")
                  .doc(doc.mallName)
                  .delete()
                  .then(() => console.log("DELETED Successfully"))
                  .catch((error) => console.log("Error deleting mall"));
                let storageRef = storage.ref();
                let mallImageDel = storageRef.child(doc.mallImage.imageName);

                //Shop Images
                doc.shops.map((shop) =>
                  shop.shopImages.map((s) =>
                    storageRef
                      .child(s.ImageName)
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
              }}
            >
              <IoMdCloseCircle />
            </div>
          )}
          <div>
            <img
              className={classes.image}
              src={doc.mallImage.imageUrl}
              alt="images"
            />
          </div>
        </div>
      ) : (
        <div className={classes.imageContainer}>
          <img className={classes.image} src={NoImage} alt="images" />
        </div>
      )}
      <div className={classes.mallDetail}>
        <p className={classes.title}>
          {doc.mallName}
          <span className={classes.midLine}> | </span>
          {doc.mallAddress}
        </p>
        <p className={classes.mallTime}>11 AM - 9 PM, +977-0000000</p>
      </div>
    </div>
  );
};

export default MallCardComponent;
