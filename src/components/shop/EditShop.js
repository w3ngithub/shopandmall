import React from "react";
import CommonShopForm from "./CommonShopForm";

const ShopForm = ({
  edit,
  dataShop,
  editDispatch,
  index,
  setImagesToRemove,
  addedShopImagesDispatch,
  addedShopImages,
  control,
  getValues,
  mallTime,
  mallLevel,
}) => {
  const closeShopForm = (dataShop) => {
    editDispatch({
      type: "REMOVE_SHOP_FORM",
      payload: {
        dataShop,
      },
    });
    setImagesToRemove((prevState) => [
      ...prevState,
      ...dataShop.shopImages.map((image) => image),
    ]);
  };

  //Remove Image

  const removeImage = (img, index) => {
    console.log(index);
    setImagesToRemove((prevState) => [...prevState, img]);
    editDispatch({
      type: "REMOVE_IMAGE",
      payload: {
        img,
        index,
      },
    });
  };

  return (
    <CommonShopForm
      {...{
        edit,
        dataShop,
        editDispatch,
        index,
        setImagesToRemove,
        addedShopImagesDispatch,
        addedShopImages,
        removeImage,
        closeShopForm,
        control,
        getValues,
        mallTime,
        mallLevel,
      }}
    />
  );
};

export default ShopForm;
