import { useParams } from "react-router-dom";
import { fireStore } from "../firebase/config";
import React, { useEffect, useState } from "react";
import classes from "../styles/single.module.css";
import modalclasses from "../components/single/modal.module.css";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { FaRegWindowClose } from "react-icons/fa";
import { BiImage, BiVideo } from "react-icons/bi";

import SkeletonText from "../skeletons/SkeletonText";
import SkeletonBlock from "../skeletons/SkeletonBlock";
import SkeletonShopCard from "../skeletons/SkeletonShopCard";

const SingleShop = () => {
  const [mall, setMall] = useState();
  const { id, type } = useParams();
  const docId = id.replace("_", " ");

  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);

  const [galleryImage, setGalleryImage] = useState([]);
  const [ind, setInd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fireStore
        .collection("Shopping Mall")
        .doc(docId)
        .onSnapshot((doc) => {
          setMall(doc.data());
          setLoading(false);
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

      {loading ? (
        <div className={classes.mainContainerShop}>
          <div className={classes.topImage}>
            <SkeletonBlock />
          </div>

          <div className={classes.mainSkeleton}>
            <div
              // style={{ borderBottom: "2px solid #C1C1C1" }}
              className={`${classes.details} ${classes.shopDetailsSkeleton}`}
            >
              <h1>
                <SkeletonText />
              </h1>

              <SkeletonText />

              <SkeletonText />
            </div>

            <div className={classes.descriptionSkeleton}>
              <h3>Description</h3>

              <SkeletonText />
            </div>

            <div className={classes.container}>
              {[1, 2, 3, 5, 6].map((n) => (
                <SkeletonShopCard key={n} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        mall?.shops?.map(
          (shop, ind) =>
            type === shop.shopName && (
              <div key={ind} className={classes.mainContainerShop}>
                <div className={classes.topImage}>
                  <img src={shop.shopImages[0].url} alt="" />
                </div>

                <div className={classes.mainShop}>
                  <div className={classes.box}>
                    <div className={classes.photosBox}>
                      <div>
                        <BiImage className={classes.icon} />
                        Photos
                      </div>
                      <div className={classes.number}>
                        {shop.shopImages.length}
                      </div>
                    </div>
                    <div className={classes.videosBox}>
                      <div>
                        <BiVideo className={classes.icon} />
                        Videos
                      </div>
                      <div className={classes.number}>0</div>
                      {/* Need to add Dynamic value */}
                    </div>
                  </div>

                  <div
                    style={{ borderBottom: "2px solid rgb(244,244,244)" }}
                    className={classes.details}
                  >
                    <h1>{shop.shopName}</h1>
                    <p>
                      <b>{mall.mallName}</b>
                    </p>
                    <p>
                      {mall.timings[0].openTime} - {mall.timings[0].closeTime},
                      <span> +977 - {mall.phoneNumber}</span>
                    </p>
                  </div>

                  <div className={classes.description}>
                    <h3>Description</h3>
                    <p>{shop.shopDescription}</p>
                  </div>

                  <div className={classes.container}>
                    {shop.shopImages &&
                      shop.shopImages.map((s, i) => {
                        return (
                          <div key={i} className={classes.wrapper}>
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
                        );
                      })}
                  </div>
                </div>
              </div>
            )
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
