import { useHistory, useLocation, useParams } from "react-router-dom";
import { fireStore } from "../firebase/config";
import React, { useEffect, useState } from "react";
import classes from "../styles/single.module.css";
import modalclasses from "../components/single/modal.module.css";
import EditModal from "../components/single/Modal";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FaRegWindowClose, FaEdit } from "react-icons/fa";
import { BiImage, BiVideo } from "react-icons/bi";
import SkeletonText from "../skeletons/SkeletonText";
import SkeletonBlock from "../skeletons/SkeletonBlock";
import SkeletonShopCard from "../skeletons/SkeletonShopCard";
// import ReactPlayer from "react-player";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Image from "../assets/images/defaultImage.png";
import { ToastContainer, toast } from "react-toastify";

const SingleShop = () => {
  const [mall, setMall] = useState(null);
  const { id, type } = useParams();
  const docId = id.replace("_", " ");
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedShop, setSelectedShop] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const history = useHistory();
  const [galleryImage, setGalleryImage] = useState([]);
  const [ind, setInd] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(mall);
  const [showVideo, setShowVideo] = useState({});
  function toggleShowVideo(url) {
    showVideo[url] = !Boolean(showVideo[url]);
    setShowVideo({ showVideo });
    // if (showVideo[url]) {
    //   if (showPlayButton) {
    //     this.setState({ showGalleryPlayButton: false });
    //   }
    //   if (showFullscreenButton) {
    //     this.setState({ showGalleryFullscreenButton: false });
    //   }
    // }
  }
  console.log(showVideo.embedUrl);
  const renderVideo = (embedUrl, original) => {
    return (
      <div>
        {showVideo[embedUrl] ? (
          <div className="video-wrapper">
            <a
              className="close-video"
              // onClick={toggleShowVideo(embedUrl)}
            ></a>
            <iframe
              width="560"
              height="315"
              src={embedUrl}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <a>
            <div className="play-button"></div>
            <img className="image-gallery-image" src={original} />
          </a>
        )}
      </div>
    );
  };
  const location = useLocation();
  const openEditModal = () => {
    const shop = mall.shops.find((shop) => shop.shopName === type);
    setShowEditModal(true);
    setSelectedShop(shop);
  };
  useEffect(() => {
    const fetchData = async () => {
      await fireStore
        .collection("Shopping Mall")
        .doc(docId)
        .onSnapshot((doc) => {
          setMall(doc.data());
          setLoading(false);
          doc?.data()?.shops?.map((shop) =>
            shop.shopVideo
              ? type === shop.shopName &&
                (setGalleryImage((prevState) => [
                  ...prevState,
                  {
                    original: Image,
                    thumbnail: Image,
                    thumbnailClass: "thumbnail",
                    embedUrl: shop.shopVideo.url,
                    renderItem: () => renderVideo(shop.shopVideo.url, Image),
                  },
                ]),
                shop.shopImages.map((s) =>
                  setGalleryImage((prevState) => [
                    ...prevState,
                    {
                      original: s.url,
                      thumbnail: s.url,
                      thumbnailClass: "thumbnail",
                    },
                  ])
                ))
              : type === shop.shopName &&
                shop.shopImages.map((s) =>
                  setGalleryImage((prevState) => [
                    ...prevState,
                    {
                      original: s.url,
                      thumbnail: s.url,
                      thumbnailClass: "thumbnail",
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
      {showEditModal && (
        <EditModal
          setShowModal={setShowEditModal}
          mall={mall}
          dataToEdit={selectedShop}
          edit={true}
          setShowEditModal={setShowEditModal}
          toast={toast}
        />
      )}
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
                  <img src={shop?.shopImages[0].url} alt="" />
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
                      <div className={classes.number}>
                        {shop.shopVideo ? 1 : 0}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ borderBottom: "2px solid rgb(244,244,244)" }}
                    className={classes.shopDetails}
                  >
                    <div>
                      <h1>{shop.shopName}</h1>
                      <p>
                        <b>{mall.mallName}</b>
                      </p>
                      <p>
                        {mall.timings[0].openTime} - {mall.timings[0].closeTime}
                        ,<span> +977 - {mall.phoneNumber}</span>
                      </p>
                    </div>
                    {location.pathname.split("/")[1] === "admin" && (
                      <button
                        className={classes.editBtn}
                        onClick={openEditModal}
                      >
                        <FaEdit className={classes.editIcon} />
                        <span className={classes.text}>Edit</span>
                      </button>
                    )}
                  </div>
                  <div className={classes.description}>
                    <h3>Description</h3>
                    <p>{shop.shopDescription}</p>
                  </div>
                  <div className={classes.container}>
                    {shop.shopVideo ? (
                      <div className={classes.wrapper}>
                        {/* <ReactPlayer
                          controls
                          url={shop.shopVideo.url}
                          width="100%"
                          height="200px"
                          onClick={() => {
                            setModal(true);
                            setInd(0);
                          }}
                        /> */}
                      </div>
                    ) : null}
                    {shop.shopImages &&
                      shop.shopImages.map((s, i) => {
                        return (
                          <div key={i} className={classes.wrapper}>
                            <img
                              onClick={() => {
                                setModal(true);
                                shop.shopVideo ? setInd(i + 1) : setInd(i);
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
      <ToastContainer />
    </div>
  );
};
const Modal = ({ setModal, setImage, galleryImage, ind }) => {
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
          showBullets={true}
          showPlayButton={true}
          disableArrowKeys={false}
          renderLeftNav={renderLeftNav}
          renderRightNav={renderRightNav}
        />
      </div>
    </div>
  );
};
export default SingleShop;
