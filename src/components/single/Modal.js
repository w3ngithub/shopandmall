import classes from "./modal.module.css";
import React, { useState, useEffect } from "react";
import { fireStore, storage } from "../../firebase/config";
import { IoIosAddCircle } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import useFirestore from "../../hooks/useFirestore";
import AllTimings from "../AllTimings/AllTimings";
import { checkShopValidation } from "../../utils/checkValidation";
import Loader from "../Loader/Loader";

const Modal = ({ setShowModal, docId, mall }) => {
  const { docs } = useFirestore("Shop Categories");
  const [subCategoryLists, setSubCategoryLists] = useState([]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState({});
  const [imageErrors, setImageErrors] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const { control, handleSubmit } = useForm();
  useEffect(() => setIsLoading(false), []);

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

    if (selectedShopVideo.size / 1000000 > 100) {
      alert("the size of the video must be less than 100mb");
    } else {
      setVideo({ id: Date.now(), video: selectedShopVideo });
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

      setIsLoading(true);
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
      if (video.hasOwnProperty("video")) {
        const uploadTask = storage
          .ref(video.id + video.video.name)
          .put(video.video);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            var progress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setPercentage(progress);
          },
          (error) => {},
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              result = {
                ...result,
                shopVideo: {
                  id: video.id + video.video.name,
                  videoName: video.video.name,
                  url: downloadURL,
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
                : fireStore
                    .collection("Shopping Mall")
                    .doc(docId)
                    .set({
                      ...mall,
                      shops: [result],
                    });

              setShowModal(false);
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
          : fireStore
              .collection("Shopping Mall")
              .doc(docId)
              .set({
                ...mall,
                shops: [result],
              });
        setShowModal(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

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
          setShowModal(false);
        }}
      ></div>
      <div className={classes.modal}>
        <div className={classes.header}>
          <h3 className={classes.title}>Add New Shop</h3>
        </div>
        <div className={classes.line}></div>

        <form onSubmit={handleSubmit(onSubmitHandler)} className={classes.form}>
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
                message: "* Number is Required",
              },
            }}
          />

          <textarea
            rows="4"
            cols="50"
            type="text"
            placeholder="Description"
            name="shopDescription"
            onChange={onChangeHandler}
            className={classes.textarea}
          />
          <div className={classes.inputdiv}>
            <select
              name="category"
              className={classes.inputcategory}
              onChange={(e) => {
                onChangeHandler(e);
                setSubCategoryLists([
                  ...docs.find(
                    (category) => category.category === e.target.value
                  ).rowContent.rowData,
                ]);
              }}
            >
              <option hidden>Categories</option>
              {docs.map(({ id, category }) => (
                <option key={id} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              name="subCategory"
              onChange={onChangeHandler}
              className={classes.inputcategory}
            >
              <option hidden>SubCategories</option>
              {subCategoryLists.map(({ id, subCategory }) => (
                <option key={id} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
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
            {images &&
              images.map((image, ind) => (
                <p key={ind} className={classes.image}>
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
            />
            <IoIosAddCircle className={classes.addIcon} />
          </label>
          <div className={classes.selectedImages}>
            {video.hasOwnProperty("video") && (
              <p className={classes.image}>{video.video.name}</p>
            )}
          </div>
          {isLoading && <Loader loadingPercentage={percentage} />}

          <button
            className={isLoading ? classes.submitBtnOnLoad : classes.submitBtn}
            type="submit"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
