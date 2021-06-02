import React from "react";
import classes from "../Dashboard/dashboard.module.css";
import NoImage from "../../image/No_Image_Available.jpg";
import { useHistory, useLocation } from "react-router-dom";
import { fireStore, storage } from "../../firebase/config";

const Mall = ({ docs }) => {
  console.log("malls", docs);
  const history = useHistory();
  const location = useLocation();

  return (
    <div className={classes.container}>
      {docs?.map((doc, ind) =>
        location.pathname === "/admin/dashboard" ||
        location.pathname === "/" ? (
          ind <= 2 && (
            <div
              className={classes.wrapper}
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
                        let mallImageDel = storageRef.child(
                          doc.mallImage.imageName
                        );

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
                      <i className="fad fa-times-circle"></i>{" "}
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
              <p className={classes.title}>{doc.mallName}</p>
              <p>({doc.mallAddress})</p>
            </div>
          )
        ) : (
          <div
            className={classes.wrapper}
            key={doc.id}
            onClick={() =>
              location.pathname.split("/")[1] !== "admin"
                ? history.push("/malls/" + doc.id.replace(" ", "_"))
                : history.push("/admin/malls/" + doc.id.replace(" ", "_"))
            }
          >
            {doc.mallImage ? (
              <div className={classes.imageContainer}>
                {location.pathname !== "/malls" && (
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
                      let mallImageDel = storageRef.child(
                        doc.mallImage.imageName
                      );

                      //Shop Images
                      doc &&
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
                    <i className="fad fa-times-circle"></i>{" "}
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
            <p className={classes.title}>{doc.mallName}</p>
            <p>({doc.mallAddress})</p>
          </div>
        )
      )}
    </div>
  );
};

export default Mall;
