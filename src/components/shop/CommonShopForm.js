import React, { useState, useEffect } from "react";
import classes from "./shopform.module.css";
import { IoIosClose } from "react-icons/io";
import AllTimings from "../AllTimings/AllTimings";
import useFirestore from "../../hooks/useFirestore";
import { Controller } from "react-hook-form";
import Loader from "../Loader/Loader";

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
  index2,
  addedShopImagesDispatch,
  addedShopImages,
  removeImage,
  control,
  getValues,
  mallTime,
  mallLevel,
  videoUploadPercentage = 0,
  isLoading,
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

    if (selectedShopVideo.size / 1000000 > 100) {
      alert("the size of the video must be less than 100mb");
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

  useEffect(() => {
    if (edit && docs.length > 0) {
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
                {error && <p className={classes.error}>{error.message}</p>}
              </>
            )}
            rules={{ required: { value: true, message: "* Name is Required" } }}
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
            defaultValue={edit && getValues(`shops[${index}].shopPhoneNumber`)}
            render={({
              field: { onChange },
              fieldState: { error, invalid },
            }) => (
              <>
                <input
                  type="number"
                  placeholder="Phone Number"
                  name="shopPhoneNumber"
                  value={edit ? dataShop?.shopPhoneNumber : s?.shopPhoneNumber}
                  onChange={(e) => {
                    onChangeHandler(e);
                    onChange(e);
                  }}
                  className={classes.input}
                />
                {error && <p className={classes.error}>{error.message}</p>}
              </>
            )}
            rules={{
              required: { value: true, message: "* Number is Required" },
            }}
          />
        </div>

        <textarea
          type="text"
          placeholder="Description"
          name="shopDescription"
          value={edit ? dataShop?.shopDescription : s?.shopDescription}
          onChange={onChangeHandler}
          className={classes.textarea}
        />
        <select
          name="category"
          onChange={(e) => {
            onChangeHandler(e);
            setSubCategoryLists([
              ...docs.find((category) => category.category === e.target.value)
                .rowContent.rowData,
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
        <select
          name="subCategory"
          onChange={onChangeHandler}
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

        {shopImageError && <p>{shopImageError}</p>}
        <label className={classes.label}>
          <input multiple type="file" onChange={shopImageHandler} />
          <span>
            <div className={classes.imgButton}>Add Image</div>
          </span>
        </label>
        {!edit && (
          <p className={classes.para}>**First chosen Image will be Thumnail</p>
        )}
        <div className={classes.selectedImages}>
          {edit &&
            dataShop?.shopImages?.map((img, i) => (
              <p key={i} className={classes.image}>
                <button
                  className={classes.button}
                  type="button"
                  onClick={() => removeImage(img, index)}
                >
                  <IoIosClose />
                </button>
                {img.ImageName}
              </p>
            ))}
          {edit &&
            addedShopImages?.map((img, ind) =>
              img.id === index
                ? img?.images?.map((img, i) => (
                    <p key={i} className={classes.image}>
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
                      {img.name}
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
                    {img?.name}
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
        {!edit && (
          <p className={classes.para}>
            **the size of the video must be less than 100mb
          </p>
        )}
        {!edit &&
          shopVideoState.map((video, i) =>
            video.id === index ? (
              <p key={i} className={classes.image}>
                <button
                  className={classes.button}
                  type="button"
                  onClick={() => shopVideoDispatch({ type: "REMOVE", index })}
                >
                  <IoIosClose />
                </button>
                {video.video.name}
              </p>
            ) : null
          )}
        {edit && dataShop.shopVideo && (
          <p className={classes.image}>
            <button className={classes.button} type="button">
              <IoIosClose />
            </button>
            {dataShop.shopVideo.videoName}
          </p>
        )}
        {isLoading && <Loader loadingPercentage={videoUploadPercentage} />}
      </div>
    </div>
  );
};

export default CommonShopForm;
