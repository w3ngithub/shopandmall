import Loader from "../Loader/Loader";
import classes from "./modal.module.css";
import { IoIosClose } from "react-icons/io";
import { useHistory } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import AllTimings from "../AllTimings/AllTimings";
import React, { useState, useEffect } from "react";
import useFirestore from "../../hooks/useFirestore";
import { useForm, Controller } from "react-hook-form";
import { fireStore, storage } from "../../firebase/config";
import { checkShopValidation } from "../../utils/checkValidation";

const Modal = ({
  setShowModal,
  docId,
  mall,
  dataToEdit,
  edit = false,
  toast,
  setShowEditModal,
}) => {
  const { docs } = useFirestore("Shop Categories");
  const [subCategoryLists, setSubCategoryLists] = useState([]);
  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [video, setVideo] = useState({});
  const [removedVideo, setRemovedVideo] = useState({});
  const [imageErrors, setImageErrors] = useState("");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [videoPercentage, setVideoPercentage] = useState(0);
  const [removedVideoThumbnail, setRemovedVideoThumbnail] = useState(null);
  const { control, handleSubmit } = useForm();

  const [shop, setShop] = useState({
    shopName: "",
    shopDescription: "",
    shopLevel: "",
    shopPhoneNumber: "",
    category: "",
    subCategory: "",
    timings: [{ id: 1, label: "Everyday" }, { id: 2 }],
    shopImages: [{ id: "", imageName: "", url: "" }],
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setShop({
      ...shop,
      [name]: value,
    });
  };

  const types = ["image/jpeg", "image/png"];

  const successNotification = () =>
    toast.success(edit ? "Successfully Updated" : "Successfully Saved!", {
      position: "bottom-right",
      autoClose: 2000,
      onOpen: () => {
        if (edit) {
          setShowEditModal();
          history.push(`/admin/${mall.mallName}/shops/${shop.shopName}`);
        } else {
          setShowModal();
          history.push(`/admin/malls/${mall.mallName}`);
        }
      },
    });

  const shopImageHandler = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      let selectedShopImages = e.target.files[i];

      if (selectedShopImages && types.includes(selectedShopImages.type)) {
        setImages((prevState) => [...prevState, selectedShopImages]);
      } else {
        setImageErrors("Please select an image file  (jpeg or png)");
      }
    }
  };

  const shopVideoHandleer = (e) => {
    const selectedShopVideo = e.target.files[0];

    if (selectedShopVideo?.size / 1000000 > 100) {
      alert("the size of the video must be less than 100mb");
      return;
    }

    if (edit && video.hasOwnProperty("videoName")) {
      setRemovedVideo(video);
      setRemovedVideoThumbnail(video.thumbnail.id);
    }

    setVideo({ id: Date.now(), video: selectedShopVideo });
  };

  const videoThumbnailHandler = (e) => {
    const selectedImage = e.target.files[0];

    if (edit) {
      if (video?.thumbnail?.hasOwnProperty("id")) {
        setRemovedVideoThumbnail(video.thumbnail.id);
      }

      setVideo({
        ...video,
        thumbnail: {
          id: Date.now(),
          name: selectedImage.name,
          thumbnail: selectedImage,
        },
      });
    } else {
      setVideo({
        ...video,
        thumbnail: {
          id: Date.now(),
          name: selectedImage.name,
          thumbnail: selectedImage,
        },
      });
    }
  };
  const onManualTimeChange = (rowId, name, value) => {
    setShop({
      ...shop,
      timings: [
        ...shop.timings.map((shop) =>
          shop.id === rowId
            ? {
                ...shop,
                [name]: value,
              }
            : shop
        ),
      ],
    });
  };
  const onDefaultTimeChange = (name, value) => {
    setShop({
      ...shop,
      timings: [{ ...shop.timings[0], [name]: value }],
    });
  };

  const addMoreTimingsFields = () => {
    setShop({ ...shop, timings: [...shop.timings, { id: Date.now() }] });
  };

  const onRemoveTimingsField = (rowId) => {
    setShop({
      ...shop,
      timings: [...shop.timings.filter((shop) => shop.id !== rowId)],
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      //shop validation
      const { shopTimeError, shopImageError } = checkShopValidation(
        shop,
        images
      );
      if (shopTimeError) {
        alert(`please fill the opening and closing time of shop`);
        return;
      }

      if (shopImageError) {
        alert("please upload an image of shop");
        return;
      }

      if (video.hasOwnProperty("video") && !video.hasOwnProperty("thumbnail")) {
        alert("Please upload thumbnail for video");
        return;
      }

      setIsLoading(true);
      setPercentage(30);
      await Promise.all(
        images.map((image) => storage.ref(image.name).put(image))
      );

      const shopImageUrl = await Promise.all(
        images.map((image) => storage.ref(image.name).getDownloadURL())
      );

      let result = {
        id: Math.random(),
        shopName: shop.shopName,
        shopDescription: shop.shopDescription,
        shopLevel: shop.shopLevel,
        shopPhoneNumber: shop.shopPhoneNumber,
        category: shop.category,
        subCategory: shop.subCategory,
        timings: shop.timings,
        shopImages: shopImageUrl.map((items, index) => ({
          id: Math.random() + images[index].name,
          ImageName: images[index].name,
          url: items,
        })),
      };
      setPercentage(60);
      if (video.hasOwnProperty("video")) {
        const uploadTask = storage
          .ref(video.id + video.video.name)
          .put(video.video);

        let videoThumbnailUrl = [];
        await Promise.all(
          [video].map((video) =>
            storage
              .ref(video.thumbnail.id + video.thumbnail.thumbnail.name)
              .put(video.thumbnail.thumbnail)
          )
        );

        videoThumbnailUrl = await Promise.all(
          [video].map((video) =>
            storage
              .ref(video.thumbnail.id + video.thumbnail.thumbnail.name)
              .getDownloadURL()
          )
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            var progress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setVideoPercentage(progress);
          },
          (error) => {},
          () => {
            setPercentage(100);
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              result = {
                ...result,
                shopVideo: {
                  id: video.id + video.video.name,
                  videoName: video.video.name,
                  url: downloadURL,
                  thumbnail: {
                    id: video.thumbnail.id + video.thumbnail.thumbnail.name,
                    thumbnail: videoThumbnailUrl[0],
                    name: video.thumbnail.thumbnail.name,
                  },
                },
              };
              mall.shops.length > 0
                ? fireStore
                    .collection("Shopping Mall")
                    .doc(docId)
                    .set({
                      ...mall,
                      shops: [...mall.shops, result],
                    })
                    .then(() => {
                      successNotification();
                    })
                : fireStore
                    .collection("Shopping Mall")
                    .doc(docId)
                    .set({
                      ...mall,
                      shops: [result],
                    })
                    .then(() => {
                      successNotification();
                    });
            });
          }
        );
      } else {
        //FireStore
        mall.shops.length > 0
          ? fireStore
              .collection("Shopping Mall")
              .doc(docId)
              .set({
                ...mall,
                shops: [...mall.shops, result],
              })
              .then(() => successNotification())
          : fireStore
              .collection("Shopping Mall")
              .doc(docId)
              .set({
                ...mall,
                shops: [result],
              })
              .then(() => successNotification());
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (video.hasOwnProperty("video") && !video.hasOwnProperty("thumbnail")) {
      alert("Please upload thumbnail for video");
      return;
    }

    setIsLoading(true);

    setPercentage(30);

    if (removedImages.length > 0) {
      removedImages.forEach((image) =>
        storage.ref().child(image.ImageName).delete()
      );
    }
    if (removedVideo.length > 0) {
      removedVideo.forEach((video) => storage.ref().child(video.id).delete());
    }

    if (removedVideoThumbnail !== null) {
      storage.ref().child(removedVideoThumbnail).delete();
    }

    let shopVideoUrl = [],
      shopTemp = { ...shop };
    setPercentage(60);

    if (typeof video?.thumbnail?.thumbnail === "object") {
      console.log("new thumbnail");
      let videoThumbnailUrl = [];
      await Promise.all(
        [video].map((video) =>
          storage
            .ref(video.thumbnail.id + video.thumbnail.thumbnail.name)
            .put(video.thumbnail.thumbnail)
        )
      );

      videoThumbnailUrl = await Promise.all(
        [video].map((video) =>
          storage
            .ref(video.thumbnail.id + video.thumbnail.name)
            .getDownloadURL()
        )
      );

      shopTemp = {
        ...shopTemp,
        shopVideo: {
          ...shopTemp.shopVideo,
          thumbnail: {
            id: video.thumbnail.id + video.thumbnail.name,
            name: video.thumbnail.name,
            thumbnail: videoThumbnailUrl[0],
          },
        },
      };

      if (video.hasOwnProperty("video")) {
        await Promise.all(
          [video].map(({ id, video, uniqueId }) => {
            const uploadTask = storage
              .ref()
              .child(uniqueId + video.name)
              .put(video);
            uploadTask.on("state_changed", (snapshot) => {
              var progress = Math.floor(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setVideoPercentage(progress);
            });
            return uploadTask;
          })
        );

        shopVideoUrl = await Promise.all(
          [video].map(({ id, video, uniqueId }) =>
            storage.ref(uniqueId + video.name).getDownloadURL()
          )
        );

        shopTemp = {
          ...shopTemp,
          shopVideo: {
            ...shopTemp.shopVideo,
            id: video.id + video.video.name,
            videoName: video.video.name,
            url: shopVideoUrl[0],
          },
        };
      }
    }

    setPercentage(80);
    if (images.length > 0) {
      await Promise.all(
        images.map((image) => storage.ref(image.name).put(image))
      );

      const shopImageUrl = await Promise.all(
        images.map((image) => storage.ref(image.name).getDownloadURL())
      );
      shopTemp = {
        ...shopTemp,
        shopImages: [
          ...shopTemp.shopImages,
          ...images.map((img, i) => ({
            id: Math.random() + img.name,
            ImageName: img.name,
            url: shopImageUrl[i],
          })),
        ],
      };
    }

    fireStore
      .collection("Shopping Mall")
      .doc(mall.mallName)
      .update({
        ...mall,
        shops: [
          ...mall.shops.map((s) => (s.id === shop.id ? { ...shopTemp } : s)),
        ],
      })
      .then(() => {
        successNotification();
      });
    setPercentage(100);
  };

  useEffect(() => {
    setIsLoading(false);

    if (edit) {
      setShop(dataToEdit);
      setVideo(dataToEdit.shopVideo || {});
    }

    if (edit && docs.length > 0) {
      setSubCategoryLists([
        ...docs.find((category) => category.category === dataToEdit.category)
          .rowContent.rowData,
      ]);
    }
  }, [dataToEdit, docs]);

  let listOfMallTimes = [mall.timings[0]];

  shop?.timings?.forEach((time, index) => {
    if (index > 0) {
      let isDayPresentInMallTime = mall.timings.findIndex(
        (t) => t.label === time.label
      );
      if (isDayPresentInMallTime > 0) {
        listOfMallTimes[index] = mall.timings[isDayPresentInMallTime];
      }
    }
  });

  return (
    <div className={classes.modalContainer}>
      <div
        className={classes.modalBackground}
        onClick={() => {
          setShowModal();
        }}
      ></div>
      <div className={classes.modal}>
        <div className={classes.header}>
          <h3 className={classes.title}>
            {edit ? "Update Shop" : "Add New Shop"}
          </h3>
          <IoIosClose
            className={classes.closeIcon}
            onClick={() => setShowModal(false)}
          />
        </div>
        <div className={classes.line}></div>

        <form
          onSubmit={edit ? handleEditSubmit : handleSubmit(onSubmitHandler)}
          className={classes.form}
        >
          <div className={classes.inputdiv}>
            <Controller
              control={control}
              name="shopName"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className={classes.formGroup}>
                  <input
                    type="text"
                    placeholder="Name of Shop"
                    name="shopName"
                    value={shop.shopName}
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                    }}
                    className={classes.input}
                  />
                  {error && <p className={classes.error}>{error.message}</p>}
                </div>
              )}
              rules={{
                required: { value: true, message: "* Name is Required" },
              }}
            />
            <Controller
              control={control}
              name="shopLevel"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className={classes.formGroup}>
                  <input
                    type="number"
                    placeholder="Level"
                    name="shopLevel"
                    value={shop.shopLevel}
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                    }}
                    className={classes.input}
                  />
                  {error && <p className={classes.error}>{error.message}</p>}
                  {error?.type === "validate" && (
                    <p className={classes.error}>
                      * level must be equal to or less than mall level (
                      {mall.levels})
                    </p>
                  )}
                </div>
              )}
              rules={{
                required: { value: true, message: "* Level is Required" },
                validate: (value) => value <= mall.levels,
              }}
            />
          </div>

          <Controller
            control={control}
            name="shopPhoneNumber"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <div className={classes.formGroup}>
                <input
                  type="number"
                  placeholder="Phone number"
                  name="shopPhoneNumber"
                  value={shop.shopPhoneNumber}
                  onChange={(e) => {
                    onChangeHandler(e);
                    onChange(e);
                  }}
                  className={classes.input}
                />
                {error && <p className={classes.error}>{error.message}</p>}
              </div>
            )}
            rules={{
              required: {
                value: true,
                message: "* Number is required",
              },
            }}
          />
          <Controller
            control={control}
            name="shopDescription"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <div className={classes.formGroup}>
                <textarea
                  rows="4"
                  cols="50"
                  type="text"
                  placeholder="Description"
                  name="shopDescription"
                  value={shop.shopDescription}
                  onChange={(e) => {
                    onChangeHandler(e);
                    onChange(e);
                  }}
                  className={classes.textarea}
                />
                {error && <p className={classes.error}>{error.message}</p>}
              </div>
            )}
            rules={{
              required: {
                value: true,
                message: "* Description is required",
              },
            }}
          />

          <div className={classes.inputdiv}>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className={classes.selectInput}>
                  <select
                    name="category"
                    className={classes.inputcategory}
                    onChange={(e) => {
                      onChange(e);
                      onChangeHandler(e);
                      setSubCategoryLists([
                        ...docs.find(
                          (category) => category.category === e.target.value
                        ).rowContent.rowData,
                      ]);
                    }}
                    value={shop.category}
                  >
                    <option hidden>Categories</option>
                    {docs.map(({ id, category }) => (
                      <option key={id} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {error && <p className={classes.error}>{error.message}</p>}
                </div>
              )}
              rules={{
                required: {
                  value: true,
                  message: "* Category is required",
                },
              }}
            />
            <Controller
              control={control}
              name="subCategory"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className={classes.selectInput}>
                  <select
                    name="subCategory"
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                    }}
                    className={classes.inputcategory}
                    value={shop.subCategory}
                  >
                    <option hidden>SubCategories</option>
                    {subCategoryLists.map(({ id, subCategory }) => (
                      <option key={id} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>

                  {error && <p className={classes.error}>{error.message}</p>}
                </div>
              )}
              rules={{
                required: {
                  value: true,
                  message: "* Subcategory is required",
                },
              }}
            />
          </div>

          <AllTimings
            state={shop}
            index={mall.shops.length}
            onManualTimeChange={onManualTimeChange}
            onDefaultTimeChange={onDefaultTimeChange}
            addMoreTimingsFields={addMoreTimingsFields}
            onRemoveTimingsField={onRemoveTimingsField}
            isShop={true}
            isModal={true}
            mallTime={listOfMallTimes}
          />

          {imageErrors && <p>{imageErrors}</p>}
          <label className={classes.label}>
            Add Images
            <input
              className={classes.upload}
              multiple
              type="file"
              onChange={shopImageHandler}
            />
            <IoIosAddCircle className={classes.addIcon} />
          </label>

          <div className={classes.selectedImages}>
            {edit &&
              shop.shopImages.map((image, ind) => (
                <p className={classes.image} key={ind}>
                  <button
                    className={classes.button}
                    type="button"
                    onClick={() => {
                      setRemovedImages([...removedImages, image]);
                      setShop({
                        ...shop,
                        shopImages: [
                          ...shop.shopImages.filter(
                            (img) => img.ImageName !== image.ImageName
                          ),
                        ],
                      });
                    }}
                  >
                    <IoIosClose className={classes.smallClose} />
                  </button>
                  {image.ImageName}
                </p>
              ))}
            {images &&
              images.map((image, ind) => (
                <p key={ind} className={classes.image}>
                  <button
                    className={classes.button}
                    type="button"
                    onClick={() =>
                      setImages([
                        ...images.filter((img) => img.name !== image.name),
                      ])
                    }
                  >
                    <IoIosClose />
                  </button>
                  {image.name}
                </p>
              ))}
          </div>
          <label className={classes.label}>
            Add Video
            <input
              className={classes.upload}
              type="file"
              onChange={shopVideoHandleer}
              accept="video/*"
            />
            <IoIosAddCircle className={classes.addIcon} />
          </label>
          <div className={classes.selectedImages}>
            {video?.hasOwnProperty("video") && (
              <p className={classes.image}>{video.video.name}</p>
            )}
            {edit && video?.hasOwnProperty("videoName") && (
              <p className={classes.image}>{shop.shopVideo.videoName}</p>
            )}
          </div>
          {isLoading && video?.hasOwnProperty("video") && (
            <Loader loadingPercentage={videoPercentage} />
          )}
          {(video.hasOwnProperty("video") ||
            video.hasOwnProperty("thumbnail")) && (
            <label className={classes.label}>
              Add Video Thumbnail
              <input
                className={classes.upload}
                type="file"
                onChange={videoThumbnailHandler}
              />
              <IoIosAddCircle className={classes.addIcon} />
            </label>
          )}
          <div className={classes.selectedImages}>
            {!edit && video?.thumbnail?.hasOwnProperty("thumbnail") && (
              <p className={classes.image}>{video.thumbnail.name}</p>
            )}
            {edit && video?.thumbnail?.hasOwnProperty("thumbnail") && (
              <p className={classes.image}>{video.thumbnail.name}</p>
            )}
          </div>
          {isLoading && <Loader loadingPercentage={percentage} />}
          {edit ? (
            <button
              className={
                isLoading ? classes.submitBtnOnLoad : classes.submitBtn
              }
              type="submit"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          ) : (
            <button
              className={
                isLoading ? classes.submitBtnOnLoad : classes.submitBtn
              }
              type="submit"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modal;
