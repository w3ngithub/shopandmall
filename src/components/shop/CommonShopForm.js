import Loader from "../Loader/Loader";
import classes from "./shopform.module.css";
import { IoIosClose } from "react-icons/io";
import { Controller } from "react-hook-form";
import AllTimings from "../AllTimings/AllTimings";
import React, { useState, useEffect } from "react";
import useFirestore from "../../hooks/useFirestore";

const CommonShopForm = ({
  edit,
  s,
  dispatch,
  index,
  shopImageState,
  shopImageDispatch,
  shopVideoState,
  shopVideoDispatch,
  closeShopForm,
  dataShop,
  editDispatch,
  addedShopImagesDispatch,
  addedShopImages,
  removeImage,
  removeVideo,
  setRemovedVideoThumbnail,
  control,
  getValues,
  mallTime,
  mallLevel,
  videoUploadPercentage = 0,
  isLoading,
  setVideoThumbnail,
  videoThumbnail,
}) => {
  const [shopImageError, setShopImageError] = useState(null);
  const { docs } = useFirestore("Shop Categories");
  const [subCategoryLists, setSubCategoryLists] = useState([]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    edit
      ? editDispatch({
          type: "EDIT_SHOP_INFO",
          payload: { name: name, value: value, index: index },
        })
      : dispatch({
          type: "ADD_SHOP_INFO",
          payload: { name: name, value: value, index: index },
        });
  };

  const types = ["image/jpeg", "image/png"];
  const shopImageHandler = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      let selectedShopImages = e.target.files[i];

      if (selectedShopImages && types.includes(selectedShopImages.type)) {
        if (edit) {
          addedShopImagesDispatch({
            type: "ADD",
            payload: { index, selectedShopImages },
          });
        } else {
          shopImageDispatch({
            type: "ADD",
            payload: { index, selectedShopImages },
          });
        }
      } else {
        setShopImageError("Please select an image file  (jpeg or png)");
      }
    }
  };

  const shopVideoHandler = (e) => {
    const selectedShopVideo = e.target.files[0];

    if (selectedShopVideo?.size / 1000000 > 100) {
      alert("the size of the video must be less than 100mb");
      return;
    }

    if (edit) {
      if (dataShop?.shopVideo?.hasOwnProperty("url")) {
        removeVideo(dataShop.ShopVideo, index);
      }
      if (typeof selectedShopVideo === "object") {
        shopVideoDispatch({
          type: "ADD",
          payload: { index, video: selectedShopVideo },
        });
      }
    } else {
      shopVideoDispatch({
        type: "ADD",
        payload: { index, video: selectedShopVideo },
      });
    }
  };

  const onManualTimeChange = (rowId, name, value) =>
    edit
      ? editDispatch({
          type: "ADD_SHOP_TIMINGS_MANUALLY",
          payload: { shopIndex: index, rowId, name, value },
        })
      : dispatch({
          type: "ADD_SHOP_TIMINGS_MANUALLY",
          payload: { shopIndex: index, rowId, name, value },
        });

  const onDefaultTimeChange = (name, value) =>
    edit
      ? editDispatch({
          type: "EDIT_SHOP_TIMINGS",
          payload: { index, name, value },
        })
      : dispatch({
          type: "ADD_SHOP_TIMINGS",
          payload: { index, name, value },
        });

  const addMoreTimingsFields = () =>
    s?.timings?.length !== 8 && !edit
      ? dispatch({ type: "ADD_SHOPTIMINGS_FIELDS", payload: { index } })
      : dataShop.timings.length !== 8 && edit
      ? editDispatch({ type: "ADD_SHOPTIMINGS_FIELDS", payload: { index } })
      : alert("No More Days Left");

  const onRemoveTimingsField = (rowId) =>
    edit
      ? editDispatch({
          type: "REMOVE_SHOPTIMINGS_FIELDS",
          payload: { shopIndex: index, rowId },
        })
      : dispatch({
          type: "REMOVE_SHOPTIMINGS_FIELDS",
          payload: { shopIndex: index, rowId },
        });

  const thumbnailImageHandler = (e) => {
    const selectedImage = e.target.files[0];

    if (edit) {
      if (
        typeof dataShop?.shopVideo?.thumbnail?.thumbnail === "string" &&
        !videoThumbnail.hasOwnProperty(index)
      ) {
        setRemovedVideoThumbnail((prev) => [
          ...prev,
          dataShop?.shopVideo?.thumbnail?.id,
        ]);
      }
      setVideoThumbnail((prev) => ({
        ...prev,
        [index]: { id: Date.now(), thumbnail: selectedImage },
      }));
    } else {
      shopVideoDispatch({
        type: "ADD_THUMBNAIL",
        payload: { index, thumbnail: selectedImage },
      });
    }
  };

  let listOfMallTimes = [mallTime[0]];

  s?.timings?.forEach((time, index) => {
    if (index > 0) {
      let isDayPresentInMallTime = mallTime.findIndex(
        (t) => t.label === time.label
      );
      if (isDayPresentInMallTime > 0) {
        listOfMallTimes[index] = mallTime[isDayPresentInMallTime];
      }
    }
  });

  let currentVideo = shopVideoState?.find((video) => video.id === index);

  useEffect(() => {
    if (edit && docs.length > 0 && dataShop.hasOwnProperty("category")) {
      setSubCategoryLists([
        ...docs.find((category) => category.category === dataShop.category)
          .rowContent.rowData,
      ]);
    }
  }, [docs]);

  return (
    <div className={classes.shopContainer}>
      <div
        onClick={
          edit
            ? () => {
                closeShopForm(dataShop);
              }
            : () => closeShopForm()
        }
        className={classes.close}
      >
        <IoIosClose />
      </div>
      <div className={classes.innerDiv}>
        <div className={classes.inputdiv}>
          <div>
            <Controller
              control={control}
              name={`shops[${index}].shopName`}
              defaultValue={edit && getValues(`shops[${index}].shopName`)}
              render={({
                field: { onChange },
                fieldState: { error, invalid },
              }) => (
                <>
                  <input
                    type="text"
                    placeholder="Name of Shop"
                    name="shopName"
                    value={edit ? dataShop?.shopName : s.shopName}
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                    }}
                    className={classes.input}
                  />
                  <br />
                  {error && <p className={classes.error}>{error.message}</p>}
                </>
              )}
              rules={{
                required: { value: true, message: "* Name is Required" },
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={`shops[${index}].shopLevel`}
              defaultValue={edit && getValues(`shops[${index}].shopLevel`)}
              render={({
                field: { onChange },
                fieldState: { error, invalid },
              }) => (
                <>
                  <input
                    type="number"
                    placeholder="level"
                    name="shopLevel"
                    value={edit ? dataShop?.shopLevel : s.shopLevel}
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                    }}
                    className={classes.input}
                  />
                  <br />
                  {error && <p className={classes.error}>{error.message}</p>}
                  {error?.type === "validate" && (
                    <p className={classes.error}>
                      * level must be equal to or less than mall level (
                      {mallLevel})
                    </p>
                  )}
                </>
              )}
              rules={{
                required: { value: true, message: "* Level is Required" },
                validate: (value) => value <= mallLevel,
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={`shops[${index}].shopPhoneNumber`}
              defaultValue={
                edit && getValues(`shops[${index}].shopPhoneNumber`)
              }
              render={({
                field: { onChange },
                fieldState: { error, invalid },
              }) => (
                <>
                  <input
                    type="number"
                    placeholder="Phone Number"
                    name="shopPhoneNumber"
                    value={
                      edit ? dataShop?.shopPhoneNumber : s?.shopPhoneNumber
                    }
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                    }}
                    className={classes.input}
                  />
                  <br />
                  {error && <p className={classes.error}>{error.message}</p>}
                </>
              )}
              rules={{
                required: { value: true, message: "* Number is Required" },
              }}
            />
          </div>
        </div>

        <div className={classes.inputcategory}>
          <div>
            <Controller
              control={control}
              name={`shops[${index}].category`}
              defaultValue={edit && getValues(`shops[${index}].category`)}
              render={({
                field: { onChange },
                fieldState: { error, invalid },
              }) => (
                <>
                  <select
                    name="category"
                    className={classes.input}
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                      setSubCategoryLists([
                        ...docs.find(
                          (category) => category.category === e.target.value
                        ).rowContent.rowData,
                      ]);
                    }}
                    value={edit ? dataShop.category : s.category}
                  >
                    <option hidden>Categories</option>
                    {docs.map(({ id, category }) => (
                      <option key={id} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {error && <p className={classes.error}>{error.message}</p>}
                </>
              )}
              rules={{
                required: { value: true, message: "* Category is required" },
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={`shops[${index}].subCategory`}
              defaultValue={edit && getValues(`shops[${index}].subCategory`)}
              render={({
                field: { onChange },
                fieldState: { error, invalid },
              }) => (
                <>
                  <select
                    name="subCategory"
                    className={classes.input}
                    onChange={(e) => {
                      onChangeHandler(e);
                      onChange(e);
                    }}
                    value={edit ? dataShop.subCategory : s.subCategory}
                  >
                    <option hidden>SubCategories</option>
                    {edit
                      ? subCategoryLists.map(({ id, subCategory }) => (
                          <option key={id} value={subCategory}>
                            {subCategory}
                          </option>
                        ))
                      : subCategoryLists.map(({ id, subCategory }) => (
                          <option key={id} value={subCategory}>
                            {subCategory}
                          </option>
                        ))}
                  </select>
                  {error && <p className={classes.error}>{error.message}</p>}
                </>
              )}
              rules={{
                required: { value: true, message: "* Subcategory is required" },
              }}
            />
          </div>
        </div>

        <AllTimings
          state={edit ? dataShop : s}
          index={index}
          onManualTimeChange={onManualTimeChange}
          onDefaultTimeChange={onDefaultTimeChange}
          addMoreTimingsFields={addMoreTimingsFields}
          onRemoveTimingsField={onRemoveTimingsField}
          isShop={true}
          mallTime={listOfMallTimes}
          edit={edit}
        />
        <Controller
          control={control}
          name={`shops[${index}].shopDescription`}
          defaultValue={edit && getValues(`shops[${index}].shopDescription`)}
          render={({ field: { onChange }, fieldState: { error, invalid } }) => (
            <>
              <textarea
                type="text"
                placeholder="Description"
                name="shopDescription"
                value={edit ? dataShop?.shopDescription : s?.shopDescription}
                onChange={(e) => {
                  onChangeHandler(e);
                  onChange(e);
                }}
                className={classes.textarea}
              />
              {error && <p className={classes.error}>{error.message}</p>}
            </>
          )}
          rules={{
            required: { value: true, message: "* Description is required" },
          }}
        />

        {shopImageError && <p>{shopImageError}</p>}
        <label className={classes.label}>
          <input multiple type="file" onChange={shopImageHandler} />
          <span>
            <div className={classes.imgButton}>Add Image</div>
          </span>
        </label>
        {!edit ? (
          <p className={classes.para}>**First chosen Image will be Thumnail</p>
        ) : null}
        <div>
          {edit && (
            <div className={classes.imageEditWrapper}>
              {dataShop?.shopImages?.map((img, i) => (
                <p key={i} className={classes.imageEdit}>
                  <button
                    className={classes.button}
                    type="button"
                    onClick={() => removeImage(img, index)}
                  >
                    <IoIosClose />
                  </button>
                  {img.ImageName}
                </p>
              ))}{" "}
            </div>
          )}
          {edit &&
            addedShopImages?.map((img, ind) =>
              img.id === index
                ? img?.images?.map((img, i) => (
                    <p key={i} className={classes.imageEdit}>
                      <button
                        className={classes.button}
                        type="button"
                        onClick={() =>
                          addedShopImagesDispatch({
                            type: "REMOVE_IMAGE",
                            payload: { outerIndex: ind, id: i },
                          })
                        }
                      >
                        <IoIosClose />
                      </button>
                      {img.image.name}
                    </p>
                  ))
                : null
            )}
          {!edit &&
            shopImageState?.map(
              (image, ind) =>
                ind === index &&
                image?.images?.map((img, i) => (
                  <p key={i} className={classes.image}>
                    <button
                      className={classes.button}
                      type="button"
                      onClick={() =>
                        shopImageDispatch({
                          type: "REMOVE_IMAGE",
                          payload: { outerIndex: ind, name: img?.name },
                        })
                      }
                    >
                      <IoIosClose />
                    </button>
                    {img?.image.name}
                  </p>
                ))
            )}
        </div>
        <label className={classes.label}>
          <input type="file" onChange={shopVideoHandler} accept="video/*" />
          <span>
            <div className={classes.imgButton}>Add Video</div>
          </span>
        </label>
        {!edit ? (
          <p className={classes.para}>
            **the size of the video must be less than 100mb
          </p>
        ) : null}
        {!edit
          ? shopVideoState.map((video, i) =>
              video.id === index ? (
                <p key={i} className={classes.image}>
                  <button
                    className={classes.button}
                    type="button"
                    onClick={() => shopVideoDispatch({ type: "REMOVE", index })}
                  >
                    <IoIosClose />
                  </button>
                  {video?.video?.name}
                </p>
              ) : null
            )
          : null}
        {edit && dataShop?.shopVideo?.hasOwnProperty("url") && (
          <div className={classes.imageEditWrapper}>
            <p className={classes.imageEdit}>
              <button
                className={classes.button}
                type="button"
                onClick={() => removeVideo(dataShop.shopVideo, index)}
              >
                <IoIosClose />
              </button>
              {dataShop.shopVideo.videoName}
            </p>
          </div>
        )}
        {edit &&
          shopVideoState?.map((video) =>
            video.id === index ? (
              <p className={classes.imageEdit} key={video.uniqueId}>
                <button
                  className={classes.button}
                  type="button"
                  onClick={() => removeVideo(dataShop.shopVideo, index)}
                >
                  <IoIosClose />
                </button>
                {video?.video?.name}
              </p>
            ) : null
          )}
        {isLoading && shopVideoState.length > 0 && (
          <Loader loadingPercentage={videoUploadPercentage} />
        )}

        {(currentVideo?.hasOwnProperty("video") ||
          dataShop?.hasOwnProperty("shopVideo")) && (
          <label className={classes.label}>
            <input
              type="file"
              onChange={thumbnailImageHandler}
              accept="images/*"
            />
            <span>
              <div className={classes.imgButton}>Add Video Thumbnail</div>
            </span>
          </label>
        )}
        {currentVideo?.hasOwnProperty("thumbnail") ? (
          <p className={classes.imageThumbnail}>
            {currentVideo.thumbnail.thumbnail.name}
          </p>
        ) : null}
        {edit &&
          (dataShop?.shopVideo?.hasOwnProperty("thumbnail") ||
            videoThumbnail?.hasOwnProperty(index)) && (
            <p className={classes.imageThumbnail}>
              {videoThumbnail[index]?.thumbnail?.name ??
                dataShop.shopVideo.thumbnail.name}
            </p>
          )}
      </div>
    </div>
  );
};

export default CommonShopForm;
