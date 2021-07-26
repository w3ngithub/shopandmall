import React, { useState } from "react";
import classes from "./sideImage.module.css";
import ImageGallery from "react-image-gallery";
import { FaRegWindowClose } from "react-icons/fa";
import modalclasses from "../single/modal.module.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

const SideImage = ({
  mall,
  selectedShop,
  sideImage,
  setSideImageFalse,
  galleryImages,
  hideSideImage,
}) => {
  const [modal, setModal] = useState(false);
  const [ind, setInd] = useState(null);

  // Image Gallery
  function renderLeftNav(onClick, disabled) {
    return (
      <button
        className={`${classes.imageGalleryIconLeft}`}
        disabled={disabled}
        onClick={onClick}
      >
        <BsChevronLeft className={classes.arrowIcon} />
      </button>
    );
  }

  function renderRightNav(onClick, disabled) {
    return (
      <button
        className={`${classes.imageGalleryIconRight}`}
        disabled={disabled}
        onClick={onClick}
      >
        <BsChevronRight className={classes.arrowIcon} />
      </button>
    );
  }

  console.log("asdf", galleryImages);
  return (
    <div
      className={
        sideImage === true ? classes.showSideImage : classes.hideSideImage
      }
    >
      {/* Gallery */}
      {modal === true && (
        <div className={modalclasses.mobGalleryModalBackground}>
          <div
            className={modalclasses.backdrop}
            onClick={() => {
              setModal(false);
            }}
          ></div>
          <div
            className={modalclasses.closeBtn}
            onClick={() => setModal(false)}
          >
            <FaRegWindowClose />
          </div>
          <div className={modalclasses.mobImageContainer}>
            <ImageGallery
              items={galleryImages}
              showThumbnails={false}
              startIndex={ind}
              additionalClass="app-image-gallery"
              renderLeftNav={renderLeftNav}
              renderRightNav={renderRightNav}
              showIndex={true}
            />
          </div>
        </div>
      )}

      <div className={classes.container}>
        <BsChevronLeft
          onClick={() => {
            setSideImageFalse();
            hideSideImage();
          }}
          className={classes.backIcon}
        />
      </div>

      <div className={classes.line}></div>

      <div className={classes.container}>
        <div className={classes.main}>
          <div className={classes.title}>
            <h3>{selectedShop?.shopName}</h3>
            <p>, {mall?.mallName}</p>
          </div>

          <div className={classes.media}>
            {selectedShop?.shopVideo ? (
              <div className={classes.wrapper}>
                <video
                  src={selectedShop.shopVideo.url}
                  controls={false}
                  width="100%"
                  height="200px"
                ></video>
                <FaPlay
                  onClick={() => {
                    setModal(true);
                    setInd(0);
                  }}
                  className={classes.videoIcon}
                />
              </div>
            ) : null}

            {selectedShop?.shopImages &&
              selectedShop?.shopImages.map((s, i) => {
                return (
                  <div key={i} className={classes.wrapper}>
                    <img
                      onClick={() => {
                        setModal(true);
                        selectedShop.shopVideo ? setInd(i + 1) : setInd(i);
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
    </div>
  );
};

export default SideImage;
