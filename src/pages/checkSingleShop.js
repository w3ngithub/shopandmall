import { MyContext } from "../Context";
import { FaPlay } from "react-icons/fa";
import React, { Component } from "react";
import { withRouter } from "react-router";
import ImageGallery from "react-image-gallery";
import { fireStore } from "../firebase/config";
import SideImage from "../components/SideImage";
import { BiImage, BiVideo } from "react-icons/bi";
import classes from "../styles/single.module.css";
import EditModal from "../components/single/Modal";
import SkeletonText from "../skeletons/SkeletonText";
import { ToastContainer, toast } from "react-toastify";
import SkeletonBlock from "../skeletons/SkeletonBlock";
import { FaRegWindowClose, FaEdit } from "react-icons/fa";
import SkeletonShopCard from "../skeletons/SkeletonShopCard";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import modalclasses from "../components/single/modal.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NoImage from "../image/Barline-Loading-Images-1.gif";

class SingleClassTry extends React.Component {
  static contextType = MyContext;

  constructor() {
    super();
    this.state = {
      showGalleryPlayButton: true,
      showVideo: {},
      loading: true,
      mall: null,
      galleryImage: [],
      modal: false,
      image: null,
      ind: null,
      sideImage: false,
      selectedShop: {},
      showEditModal: false,
    };

    this.setSideImageFalse = this.setSideImageFalse.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const type = this.props.match.params.type;
    const docId = id.replace("_", " ");

    const fetchData = async () => {
      await fireStore
      .collection("Shopping Mall")
      .doc(docId)
      .onSnapshot((doc) => {        
        this.setState({
          galleryImage:[]
        })
          this.setState({ mall: doc.data() });
          this.setState({ loading: false });
          doc?.data()?.shops?.map((shop) =>
            shop.shopVideo
              ? type === shop.shopName &&
                (this.setState({
                  galleryImage: [
                    ...this.state.galleryImage,
                    {
                      original: `${shop?.shopVideo?.thumbnail?.thumbnail}`,
                      originalClass: "originalVideo",
                      thumbnail: `${shop?.shopVideo?.thumbnail?.thumbnail}`,
                      thumbnailClass: "thumbnail",
                      embedUrl: `${shop.shopVideo.url}`,
                      renderItem: this._renderVideo.bind(this),
                    },
                  ],
                }),
                shop.shopImages.map((s) =>
                  this.setState({
                    galleryImage: [
                      ...this.state.galleryImage,
                      {
                        original: s.url,
                        thumbnail: s.url,
                        originalClass: "original",
                        thumbnailClass: "thumbnail",
                      },
                    ],
                  })
                ))
              : type === shop.shopName &&
                shop.shopImages.map((s) =>
                  this.setState({
                    galleryImage: [
                      ...this.state.galleryImage,
                      {
                        original: s.url,
                        thumbnail: s.url,
                        thumbnailClass: "thumbnail",
                      },
                    ],
                  })
                )
          );
        });
    };
    fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.slideInterval !== prevState.slideInterval ||
      this.state.slideDuration !== prevState.slideDuration
    ) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    }
  }

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo,
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({ showGalleryPlayButton: false });
      }

      if (this.state.showFullscreenButton) {
        this.setState({ showGalleryFullscreenButton: false });
      }
    }
  }

  _renderVideo(item) {
    return (
      <div>
        {this.state.showVideo[item.embedUrl] ? (
          <div className={classes.videoWrapper}>
            <a
              className="close-video"
              onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
            ></a>

            <video
              src={item.embedUrl}
              className={classes.video}
              controls
            ></video>
          </div>
        ) : (
          <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
            <div className={classes.playBtn}></div>
            <img className={classes.imageGalleryImage} src={item.original} />
          </a>
        )}
      </div>
    );
  }

  // Image Gallery
  renderLeftNav(onClick, disabled) {
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

  renderRightNav(onClick, disabled) {
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

  //------------------------------- New Add ------------------------------------------

  _onImageClick(event) {
    console.debug(
      "clicked on image",
      event.target,
      "at index",
      this._imageGallery.getCurrentIndex()
    );
  }

  _onImageLoad(event) {
    console.debug("loaded image", event.target.src);
  }

  _onSlide(index) {
    this._resetVideo();
    console.debug("slid to index", index);
  }

  _onPause(index) {
    console.debug("paused on index", index);
  }

  _onScreenChange(fullScreenElement) {
    console.debug("isFullScreen?", !!fullScreenElement);
  }

  _onPlay(index) {
    console.debug("playing from index", index);
  }

  _handleInputChange(state, event) {
    this.setState({ [state]: event.target.value });
  }

  _handleCheckboxChange(state, event) {
    this.setState({ [state]: event.target.checked });
  }

  _handleThumbnailPositionChange(event) {
    this.setState({ thumbnailPosition: event.target.value });
  }

  _resetVideo() {
    this.setState({ showVideo: {} });

    if (this.state.showPlayButton) {
      this.setState({ showGalleryPlayButton: true });
    }

    if (this.state.showFullscreenButton) {
      this.setState({ showGalleryFullscreenButton: true });
    }
  }

  // ----------********************** Can Memoize ************************------------
  setSideImageFalse() {
    this.setState({ sideImage: false });
  }

  _customAction = () => {
    this._imageGallery.toggleFullScreen();
    this.props.handleImageGalleryActive(false);
  };

  openEditModal() {
    const shop = this.state.mall.shops.find(
      (shop) => shop.shopName === this.props.location.pathname.split("/")[4]
    );
    this.setState({ showEditModal: true });
    this.setState({ selectedShop: shop });
  }

  render() {
    const {
      useBrowserFullscreen,
      lazyLoad,
      showBullets,
      showFullscreenButton,
      showPlayButton,
      showThumbnails,
      showIndex,
      showNav,
      thumbnailPosition,
      slideDuration,
      slideInterval,
      slideOnThumbnailOver,
      useTranslate3D,
      infinite,
      isRTL,
    } = this.props;

    let type = this.props.match.params.type;

    const { sideImageWithFooter, showSideImage, hideSideImage } = this.context;

    this.state.modal === false && (document.body.style.overflow = "auto");
    console.log(this.state?.mall?.shops);
    
    return (
      // Image Gallery Carousel
      <section className="app">
        {this.state.modal === true && (
          <div className={modalclasses.galleryModalBackground}>
            <div
              className={modalclasses.backdrop}
              onClick={() => {
                this.setState({ modal: false, image: null });
              }}
            ></div>
            {(document.body.style.overflow = "hidden")}
            <div
              className={modalclasses.closeBtn}
              onClick={() => this.setState({ modal: false })}
            >
              <FaRegWindowClose />
            </div>
            <div className={modalclasses.ImageContainer}>
              <ImageGallery
                ref={(i) => (this._imageGallery = i)}
                items={this.state.galleryImage}
                useBrowserFullscreen={useBrowserFullscreen}
                lazyLoad={lazyLoad}
                infinite={infinite}
                showBullets={showBullets}
                showFullscreenButton={showFullscreenButton}
                showPlayButton={
                  showPlayButton && this.state.showGalleryPlayButton
                }
                showThumbnails={showThumbnails}
                startIndex={this.state.ind}
                showNav={showNav}
                isRTL={isRTL}
                thumbnailPosition={thumbnailPosition}
                slideOnThumbnailOver={true}
                additionalClass="app-image-gallery"
                useTranslate3D={useTranslate3D}
                renderLeftNav={this.renderLeftNav}
                renderRightNav={this.renderRightNav}
                showIndex={true}
              />
            </div>
            <div className={modalclasses.mobImageContainer}>
              <ImageGallery
                ref={(i) => (this._imageGallery = i)}
                items={this.state.galleryImage}
                useBrowserFullscreen={useBrowserFullscreen}
                lazyLoad={lazyLoad}
                infinite={infinite}
                showBullets={showBullets}
                showFullscreenButton={false}
                showPlayButton={
                  showPlayButton && this.state.showGalleryPlayButton
                }
                showThumbnails={showThumbnails}
                startIndex={this.state.ind}
                showNav={showNav}
                isRTL={isRTL}
                thumbnailPosition={thumbnailPosition}
                slideOnThumbnailOver={true}
                additionalClass="app-image-gallery"
                useTranslate3D={useTranslate3D}
                renderLeftNav={this.renderLeftNav}
                renderRightNav={this.renderRightNav}
                showIndex={true}
                showThumbnails={false}
              />
            </div>
          </div>
        )}

        {/* Side Image */}
        <div className={classes.shopSideImage}>
          <SideImage
            mall={this.state.mall}
            selectedShop={this.state.selectedShop}
            sideImage={this.state.sideImage}
            setSideImageFalse={this.setSideImageFalse}
            galleryImages={this.state.galleryImage}
            hideSideImage={hideSideImage}
          />
        </div>
        {this.state.showEditModal && (
          <EditModal
            setShowModal={() => this.setState({ showEditModal: false })}
            mall={this.state.mall}
            dataToEdit={this.state.selectedShop}
            edit={true}
            setShowEditModal={() => this.setState({ showEditModal: false })}
            toast={toast}
          />
        )}

        {this.state.loading ? (
          <div className={classes.mainContainerShop}>
            <div className={classes.topImage}>
              <SkeletonBlock />
            </div>
            <div className={classes.mobTopImage}>
              <SkeletonBlock />
            </div>

            <div className={classes.mainSkeleton}>
              <div
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
          this.state.mall?.shops?.map(
            (shop, ind) =>
              type === shop.shopName &&
              (this.state.sideImage === true ? (
                <div className={classes.emptyPage} key={ind}></div>
              ) : (
                <div
                  key={ind}
                  className={
                    this.state.modal === true
                      ? classes.noScroll
                      : classes.mainContainerShop
                  }
                >
                  <div className={classes.topImage}>
                    <img src={shop?.shopImages[0].url} alt="" />
                  </div>
                  <div
                    className={classes.mobTopImage}
                    onClick={() => {
                      this.setState({ sideImage: true, selectedShop: shop });
                      showSideImage();
                    }}
                  >
                    <img src={shop?.shopImages[0].url} alt="" />
                    <div className={classes.imageNumber}>
                      1/{shop.shopImages.length + 1}
                    </div>
                  </div>

                  <div className={classes.mainShop}>
                    <div className={classes.box}>
                      <div
                        className={classes.photosBox}
                        onClick={
                          shop.shopVideo
                            ? () => {
                                this.setState({ modal: true, ind: 1 });
                              }
                            : () => this.setState({ modal: true, ind: 0 })
                        }
                      >
                        <div>
                          <BiImage className={classes.icon} />
                          Photos
                        </div>
                        <div className={classes.number}>
                          {shop.shopImages.length}
                        </div>
                      </div>
                      <div
                        className={
                          shop.shopVideo ? classes.videosBox : classes.emptyBox
                        }
                        onClick={
                          shop.shopVideo
                            ? () => {
                                this.setState({ modal: true, ind: 0 });
                              }
                            : null
                        }
                      >
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
                          <b>{this.state.mall?.mallName}</b>
                        </p>
                        <p>
                          {this.state.mall.timings[0].openTime} -{" "}
                          {this.state.mall.timings[0].closeTime},
                          <span> +977 - {this.state.mall.phoneNumber}</span>
                        </p>
                      </div>

                      {this.props.location.pathname.split("/")[1] ===
                        "admin" && (
                        <button
                          className={classes.editBtn}
                          onClick={this.openEditModal}
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
                        <div
                          className={classes.wrapper}
                          onClick={() => {
                            this.setState({ modal: true, ind: 0 });
                          }}
                        >
                          <video
                            src={shop.shopVideo.url}
                            controls={false}
                            width="100%"
                            height="200px"
                          ></video>
                          <FaPlay className={classes.videoIcon} />
                        </div>
                      ) : null}

                      {shop.shopImages &&
                        shop.shopImages.map((s, i) => {
                          return (
                            <div key={i} className={classes.wrapper}>
                                <LazyLoadImage
                              onClick={() => {
                                this.setState({ modal: true });
                                shop.shopVideo
                                  ? this.setState({ ind: i + 1 })
                                  : this.setState({ ind: i });
                              }}
                              className={classes.image}
                              src={s.url}
                              alt="shopImage"
                              height={200}
                              width="100%"
                              placeholderSrc={NoImage}
                              effect="blur"
                            />
                              {/* <img
                                onClick={() => {
                                  this.setState({ modal: true });
                                  shop.shopVideo
                                    ? this.setState({ ind: i + 1 })
                                    : this.setState({ ind: i });
                                }}
                                className={classes.image}
                                src={s.url}
                                alt="shopImage"
                              /> */}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))
          )
        )}
        <ToastContainer />
      </section>
    );
  }
}

export default withRouter(SingleClassTry);
