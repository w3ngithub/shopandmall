import React, { useState, useEffect } from "react";
import classes from "./shopform.module.css";
import { IoIosClose } from "react-icons/io";
import AllTimings from "../AllTimings/AllTimings";
import useFirestore from "../../hooks/useFirestore";
import { Controller } from "react-hook-form";

const CommonShopForm = ({
  edit,
  s,
  dispatch,
  index,
  shopImageState,
  shopImageDispatch,
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

  const onManualTimeChange = (rowId, name, value) =>
    dispatch({
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
    s.timings.length === 8
      ? alert("No More Days Left")
      : dispatch({ type: "ADD_SHOPTIMINGS_FIELDS", payload: { index } });

  const onRemoveTimingsField = (rowId) =>
    dispatch({
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
                    * level must match the mall levels
                  </p>
                )}
              </>
            )}
            rules={{
              required: { value: true, message: "* Level is Required" },
              validate: (value) => value < mallLevel,
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
                  type="text"
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
        >
          <option hidden>Categories</option>
          {docs.map(({ id, category }) => (
            <option key={id} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select name="subCategory" onChange={onChangeHandler}>
          <option hidden>SubCategories</option>
          {subCategoryLists.map(({ id, subCategory }) => (
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
      </div>

      <div className={classes.selectedImages}>
        {edit
          ? dataShop.shopImages
            ? dataShop.shopImages.map((img, i) => (
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
              ))
            : addedShopImages &&
              addedShopImages.map(
                (img, ind) =>
                  ind === index2 &&
                  img.images.map((img, i) => (
                    <p key={i} className={classes.image}>
                      <button
                        className={classes.button}
                        type="button"
                        onClick={() =>
                          addedShopImagesDispatch({
                            type: "REMOVE_IMAGE",
                            payload: { outerIndex: ind, name: img.name },
                          })
                        }
                      >
                        <IoIosClose />
                      </button>
                      {img.name}
                    </p>
                  ))
              )
          : shopImageState &&
            shopImageState?.map(
              (image, ind) =>
                ind === index &&
                image?.images?.map((img, i) => (
                  <p key={i} className={classes.image}>
                    <button
                      className={classes.button}
                      type="button"
                      onClick={() =>
                        addedShopImagesDispatch({
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
    </div>
  );
};

export default CommonShopForm;
