import cls from "../styles/singleMall.module.css";
import { useParams } from "react-router-dom";
import { fireStore } from "../firebase/config";
import React, { useEffect, useState } from "react";
import classes from "../styles/allMallsShops.module.css";

import modalclasses from "../components/single/modal.module.css";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { FaRegWindowClose } from "react-icons/fa";

const SingleShop = () => {
  const [mall, setMall] = useState();
  const { id, type } = useParams();
  const docId = id.replace("_", " ");

  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);

  const [galleryImage, setGalleryImage] = useState([]);
  const [ind, setInd] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fireStore
        .collection("Shopping Mall")
        .doc(docId)
        .onSnapshot((doc) => {
          setMall(doc.data());
          doc?.data()?.shops?.map(
            (shop) =>
              type === shop.shopName &&
              shop.shopImages.map((s) =>
                setGalleryImage((prevState) => [
                  ...prevState,
                  {
                    original: s.url,
                    thumbnail: s.url,
                  },
                ])
              )
          );
        });
    };

    fetchData();
  }, [docId]);

  return (
    <div>
      {modal && <Modal {...{ setModal, image, setImage, galleryImage, ind }} />}
      {/* {modal && <ImageGallery items={galleryImage} />} */}

      {mall?.shops?.map(
        (shop, ind) =>
          type === shop.shopName && (
            <div key={ind} className={classes.main}>
              <div
                style={{ borderBottom: "2px solid rgb(236, 78, 78)" }}
                className={cls.name}
              >
                <h1>{shop.shopName}</h1>
                <h3>{shop.shopDescription}</h3>
              </div>

              <div className={classes.container}>
                {shop.shopImages &&
                  shop.shopImages.map((s, i) => {
                    return (
                      <div key={i} className={classes.wrapper}>
                        <div className={classes.imageContainer}>
                          <img
                            onClick={() => {
                              setModal(true);
                              setInd(i);
                            }}
                            className={classes.image}
                            src={s.url}
                            alt="shopImage"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )
      )}
    </div>
  );
};

const Modal = ({ setModal, setImage, galleryImage, ind }) => {
  return (
    <div className={modalclasses.modalBackground}>
      <div
        className={modalclasses.backdrop}
        onClick={() => {
          setModal(false);
          setImage(null);
        }}
      ></div>
      <div className={modalclasses.closeBtn} onClick={() => setModal(false)}>
        <FaRegWindowClose />
      </div>
      <div className={modalclasses.ImageContainer}>
        <ImageGallery
          items={galleryImage}
          startIndex={ind}
          showPlayButton={false}
        />
      </div>
    </div>
  );
};

export default SingleShop;
