import Loader from "../Loader/Loader";
import EditShop from "../shop/EditShop";
import ShopForm from "../shop/ShopForm";
import classes from "./mallform.module.css";
import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline, IoIosImage } from "react-icons/io";
import AllTimings from "../AllTimings/AllTimings";
import { useForm } from "react-hook-form";

const CommonForm = ({
  edit,
  editDispatch,
  dispatch,
  state,
  editData,
  submitHandler,
  newShopForm,
  setImagesToRemove,
  addedShopImagesDispatch,
  addedShopImages,
  shopImageState,
  shopImageDispatch,
  mallImage,
  setMallImage,
  isLoading,
  setIsLoading,
  loadingPercentage,
}) => {
  //States

  const [mallImageError, setMallImageError] = useState(null);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm();

  //Change Handler
  const changeHandler = (e) => {
    const { name, value } = e.target;

    edit
      ? editDispatch({
          type: "EDIT_MALL_INFO",
          payload: { name: name, value: value },
        })
      : dispatch({
          type: "ADD_MALL_INFO",
          payload: { name: name, value: value },
        });
  };

  const types = ["image/jpeg", "image/png"];
  const imageHandler = (e) => {
    const selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setMallImage(selected);
      setMallImageError(null);
    } else {
      setMallImageError("Please select an image file  (jpeg or png)");
      setMallImage(null);
    }
  };

  const onManualTimeChange = (rowId, name, value) =>
    edit
      ? editDispatch({
          type: "ADD_TIMINGS_MANUALLY",
          payload: { rowId, name, value },
        })
      : dispatch({
          type: "ADD_TIMINGS_MANUALLY",
          payload: { rowId, name, value },
        });

  const onDefaultTimeChange = (name, value) =>
    edit
      ? editDispatch({
          type: "ADD_TIMINGS",
          payload: { name, value },
        })
      : dispatch({
          type: "ADD_TIMINGS",
          payload: { name, value },
        });

  const addMoreTimingsFields = () =>
    state?.timings?.length !== 8 && !edit
      ? dispatch({ type: "ADD_TIMINGS_FIELDS" })
      : editData.timings.length !== 8 && edit
      ? editDispatch({ type: "ADD_TIMINGS_FIELDS" })
      : alert("No More Days Left");

  const onRemoveTimingsField = (rowId) =>
    edit
      ? editDispatch({
          type: "REMOVE_TIMINGS_FIELDS",
          payload: { rowId },
        })
      : dispatch({
          type: "REMOVE_TIMINGS_FIELDS",
          payload: { rowId },
        });

  //Loading
  useEffect(() => {
    setIsLoading(false);
    if (edit) {
      reset({
        shops: [
          ...editData.shops.map((shop) => ({
            shopName: shop.shopName,
            shopLevel: shop.shopLevel,
            shopPhoneNumber: shop.shopPhoneNumber,
          })),
        ],
      });
    }
  }, []);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.formContainer}>
        <form
          className={classes.form}
          action=""
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className={classes.innerDiv}>
            <div>
              <input
                type="text"
                {...register("mallName", { required: true })}
                placeholder="Name of Mall"
                name="mallName"
                value={edit ? editData?.mallName : state?.mallName}
                onChange={changeHandler}
                className={classes.input}
              />
              {errors.mallName && (
                <p className={classes.error}>* Name is required</p>
              )}
            </div>
            <div>
              <input
                type="text"
                {...register("mallAddress", { required: true })}
                placeholder="Address"
                name="mallAddress"
                onChange={changeHandler}
                value={edit ? editData?.mallAddress : state?.mallAddress}
                className={classes.input}
              />
              {errors.mallAddress && (
                <p className={classes.error}>* Address is required</p>
              )}
            </div>
            <div>
              <input
                type="number"
                {...register("levels", { required: true })}
                placeholder="Level"
                name="levels"
                value={edit ? editData?.levels : state?.levels}
                onChange={changeHandler}
                className={classes.input}
              />
              {errors.levels && (
                <p className={classes.error}>* Levels is required</p>
              )}
            </div>

            <label className={classes.label}>
              <input
                className={classes.upload}
                type="file"
                onChange={imageHandler}
              />
              <span>
                <IoIosImage className={classes.imageIcon} />
              </span>
              <span className={classes.text}>(Add Image)</span>
            </label>
            {mallImageError && <p>{mallImageError}</p>}
          </div>
          <div>
            {mallImage ? mallImage?.name : editData?.mallImage?.imageName}
          </div>
          <div>
            <input
              type="number"
              {...register("phoneNumber", {
                required: true,
                validate: (value) => value.length === 10,
              })}
              placeholder="Phone Number"
              name="phoneNumber"
              value={edit ? editData?.phoneNumber : state?.phoneNumber}
              onChange={changeHandler}
              className={classes.input}
            />
            {errors?.phoneNumber?.type === "required" && (
              <p className={classes.error}>* Number is required</p>
            )}
            {errors?.phoneNumber?.type === "validate" && (
              <p className={classes.error}>* Number must be 10 digits</p>
            )}
          </div>

          <AllTimings
            state={edit ? editData : state}
            onManualTimeChange={onManualTimeChange}
            onDefaultTimeChange={onDefaultTimeChange}
            addMoreTimingsFields={addMoreTimingsFields}
            onRemoveTimingsField={onRemoveTimingsField}
          />

          {/*------- Shop ---------*/}

          {edit ? (
            editData?.shops?.length > 0 && (
              <h4 className={classes.name}>Shop</h4>
            )
          ) : (
            <h4 className={classes.name}>Shop</h4>
          )}

          {edit
            ? editData?.shops?.map((dataShop, index) => (
                <div key={index}>
                  <EditShop
                    {...{
                      edit,
                      setImagesToRemove,
                      editData,
                      dataShop,
                      editDispatch,
                      index,
                      addedShopImagesDispatch,
                      addedShopImages,
                      control,
                      getValues,
                      mallTime: editData?.timings,
                      mallLevel: editData?.levels,
                    }}
                  />
                  <div className={classes.line}></div>
                </div>
              ))
            : state?.shops?.map((s, index) => (
                <div key={index}>
                  <ShopForm
                    {...{
                      edit,
                      s,
                      dispatch,
                      index,
                      shopImageState,
                      shopImageDispatch,
                      control,
                      mallTime: state.timings,
                      mallLevel: state.levels,
                    }}
                  />
                  <div className={classes.line}></div>
                </div>
              ))}

          {edit === false && (
            <div onClick={newShopForm} className={classes.addShop}>
              <span className={classes.icon}>
                <IoIosAddCircleOutline />
              </span>
              Add Shop
            </div>
          )}

          {/* --------------------- */}

          {isLoading && <Loader loadingPercentage={loadingPercentage} />}

          <input
            className={isLoading ? classes.submitBtnOnLoad : classes.submitBtn}
            type="submit"
            value={
              isLoading
                ? edit
                  ? "Updating..."
                  : "Loading..."
                : edit
                ? "Update"
                : "Save"
            }
          />
        </form>
      </div>
    </div>
  );
};

export default CommonForm;
