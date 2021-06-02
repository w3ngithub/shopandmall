import React, { useState } from "react";
import classes from "./shopform.module.css";

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
}) => {
  const [shopImageError, setShopImageError] = useState(null);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    edit
      ? editDispatch({
          type: "EDIT_SHOP_INFO",
          payload: { name: name, value: value, index: index2 },
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
        shopImageDispatch({
          type: "ADD",
          payload: { index, selectedShopImages },
        });
      } else {
        setShopImageError("Please select an image file  (jpeg or png)");
      }
    }
  };

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
        <i className="fas fa-times"></i>
      </div>
      <div className={classes.innerDiv}>
        <input
          type="text"
          placeholder="Name of Shop"
          name="shopName"
          value={edit ? dataShop?.shopName : s.shopName}
          onChange={onChangeHandler}
          className={classes.input}
        />
        <textarea
          type="text"
          placeholder="Description"
          name="shopDescription"
          value={edit ? dataShop?.shopDescription : s?.shopDescription}
          onChange={onChangeHandler}
          className={classes.textarea}
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
                    onClick={() => removeImage(img, index2)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  {img.ImageName}
                </p>
              ))
            : null(
                addedShopImages &&
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
                            <i className="fas fa-times"></i>
                          </button>
                          {img.name}
                        </p>
                      ))
                  )
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
                        shopImageDispatch({
                          type: "REMOVE_IMAGE",
                          payload: { outerIndex: ind, name: img?.name },
                        })
                      }
                    >
                      <i className="fas fa-times"></i>
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
