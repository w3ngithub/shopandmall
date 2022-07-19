import React, { useState } from "react";
import classes from "../styles/Card.module.css";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NoImage from "../../image/Barline-Loading-Images-1.gif";
import { IoMdCloseCircle } from "react-icons/io";
import { fireStore, storage } from "../../firebase/config";
import { ToastContainer, toast } from "react-toastify";

import DeleteModal from "../Modal/DeleteModal";

const Shop = ({ doc, malls, single }) => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [modal, setModal] = useState(false);

  const successNotification = () =>
    toast.success("Succesfully Deleted!", {
      position: "bottom-right",
      autoClose: 2000,
      // onClose: () => history.goBack(),
    });

  const handleDelete = () => {
    let storageRef = storage.ref();

    //deletingShopImages
    doc.shopImages.map((image) =>
      storageRef
        .child(image.id)
        .delete()
        .then(() => console.log("Images deleted succesfully"))
        .catch((error) => console.log("Images not deleted"))
    );

    //deletingShopVideos
    if (doc.shopVideo) {
      storageRef
        .child(doc.shopVideo.id)
        .delete()
        .then(() => console.log("videos deleted"));
    }

    //deleting video thumbnail
    if (doc.shopVideo) {
      storageRef
        .child(doc.shopVideo.thumbnail.id)
        .delete()
        .then(() => console.log("thumbnail deleted"));
    }
    //deleting from firestore
    const newMall = {
      levels: doc.mall.levels,
      mallAddress: doc.mall.mallAddress,
      mallId: doc.mall.mallId,
      mallImage: doc.mall.mallImage,
      mallName: doc.mall.mallName,
      phoneNumber: doc.mall.phoneNumber,
      shops: doc.mall.shops.map((shop) => ({
        category: shop.category,
        id: shop.id,
        shopDescription: shop.shopDescription,
        shopImages: shop.shopImages,
        shopLevel: shop.shopLevel,
        shopName: shop.shopName,
        shopPhoneNumber: shop.shopPhoneNumber,
        subCategory: shop.subCategory,
        timings: shop.timings,
      })),
      timings: doc.mall.timings,
    };
    fireStore
      .collection(`Shopping Mall`)
      .doc(doc.mall.id)
      .update({
        shops: newMall.shops.filter((item) => item.id !== doc.id),
      })
      .then(() => {
        successNotification();
      });

    handleModal();
  };

  const handleModal = () => {
    setModal((prev) => !prev);
  };
  return (
    <div>
      {modal && <DeleteModal datas={{ handleModal, handleDelete }} />}
      {location.pathname === "/" ||
      location.pathname === "/admin/dashboard" ||
      location.pathname.split("/")[1] === "home" ||
      location.pathname.split("/")[2] === "malls" ||
      location.pathname === "/admin/shops" ||
      location.pathname.split("/")[2] === "category" ? (
        <div
          className={classes.wrapper}
          onClick={() => {
            location.pathname.split("/")[1] === "admin"
              ? history.push(
                  "/admin/" + doc.mall.mallName + "/shops/" + doc.shopName
                )
              : history.push(
                  "/mall/" + doc.mall.mallName + "/shops/" + doc.shopName
                );
          }}
        >
          {doc?.shopImages && (
            <div className={classes.imageContainer}>
              {(location.pathname === "/admin/shops" ||
                location.pathname === "/admin/dashboard" ||
                location.pathname === `/admin/malls/${id}`) && (
                <IoMdCloseCircle
                  className={classes.closeIcon}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleModal();
                  }}
                />
              )}
              <LazyLoadImage
                alt="images"
                height={180}
                src={doc?.shopImages[0]?.url}
                width="100%"
                placeholderSrc={NoImage}
                className={classes.image}
                effect="blur"
              />
            </div>
          )}

          <div className={classes.shopDetail}>
            <p className={classes.title}>
              {doc?.shopName}
              <span className={classes.midLine}> | </span>
              (Inside {doc?.mall?.mallName})
            </p>
            <p className={classes.mallTime}>
              {doc?.timings[0]?.openTime} -{doc?.timings[0]?.closeTime}, +977-
              {doc?.shopPhoneNumber}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={classes.wrapper}
          onClick={() => {
            location.pathname.split("/")[1] === "admin"
              ? history.push(
                  "/admin/" + doc.mall.mallName + "/shops/" + doc.shopName
                )
              : history.push(
                  "/mall/" + doc.mall.mallName + "/shops/" + doc.shopName
                );
          }}
        >
          {doc?.shopImages && (
            <div className={classes.imageContainer}>
              {location.pathname.split("/").includes("admin") && (
                <IoMdCloseCircle
                  className={classes.closeIcon}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleModal();
                  }}
                />
              )}
              <LazyLoadImage
                alt="images"
                height={180}
                src={doc?.shopImages[0]?.url}
                width="100%"
                placeholderSrc={NoImage}
                className={classes.image}
                effect="blur"
              />
            </div>
          )}

          <div className={classes.shopDetail}>
            <p className={classes.title}>
              {doc?.shopName}
              <span className={classes.midLine}> | </span>
              (Inside {doc?.mall?.mallName})
            </p>
            <p className={classes.mallTime}>
              {doc?.timings[0]?.openTime} -{doc?.timings[0]?.closeTime}, +977-
              {doc?.shopPhoneNumber}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
