import Loader from "../Loader/Loader";
import EditShop from "../shop/EditShop";
import ShopForm from "../shop/ShopForm";
import classes from "./mallform.module.css";
import React, { useEffect, useState } from "react";

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
}) => {
  useEffect(() => {
    setIsLoading(false);
  }, []);

  //States

  const [mallImageError, setMallImageError] = useState(null);

  //Loading
  useEffect(() => {
    setIsLoading(false);
  }, []);

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

  return (
    <div className={classes.mainContainer}>
      <div className={classes.formContainer}>
        {isLoading === true && (
          <div className={classes.loaderPosition}>
            <Loader />
          </div>
        )}
        <form className={classes.form} action="" onSubmit={submitHandler}>
          <div className={classes.innerDiv}>
            <input
              type="text"
              placeholder="Name of Mall"
              name="mallName"
              value={edit ? editData?.mallName : state?.mallName}
              onChange={changeHandler}
              className={classes.input}
            />
            <input
              type="text"
              placeholder="Address"
              name="mallAddress"
              onChange={changeHandler}
              value={edit ? editData?.mallAddress : state?.mallAddress}
              className={classes.input}
            />
            <label className={classes.label}>
              <input
                className={classes.upload}
                type="file"
                onChange={imageHandler}
              />
              <span>
                <i className="fas fa-image"></i>
              </span>
              <span className={classes.text}>(Add Image)</span>
            </label>
            {mallImageError && <p>{mallImageError}</p>}
          </div>
          <div>
            {mallImage ? mallImage?.name : editData?.mallImage?.imageName}
          </div>

          {/*------- Shop ---------*/}

          {edit ? (
            editData?.shops?.length > 0 && (
              <h4 className={classes.name}>Shop</h4>
            )
          ) : (
            <h4 className={classes.name}>Shop</h4>
          )}

          {edit
            ? editData?.shops?.map((dataShop, index2) => (
                <div key={index2}>
                  <EditShop
                    {...{
                      edit,
                      setImagesToRemove,
                      editData,
                      dataShop,
                      editDispatch,
                      index2,
                      addedShopImagesDispatch,
                      addedShopImages,
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
                    }}
                  />
                  <div className={classes.line}></div>
                </div>
              ))}

          {edit === false && (
            <div onClick={newShopForm} className={classes.addShop}>
              <span className={classes.icon}>
                <i className="far fa-plus-circle"></i>
              </span>
              Add Shop
            </div>
          )}

          {/* --------------------- */}

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
