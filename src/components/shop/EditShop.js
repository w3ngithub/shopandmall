import React from "react";
import CommonShopForm from "./CommonShopForm";

const ShopForm = ({
  edit,
  dataShop,
  editDispatch,
  index,
  setImagesToRemove,
  setRemovedVideo,
  shopVideoState,
  shopVideoDispatch,
  addedShopImagesDispatch,
  addedShopImages,
  control,
  getValues,
  mallTime,
  mallLevel,
  videoUploadPercentage,
  isLoading,
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
    setRemovedVideo((prevState) => [...prevState, dataShop.shopVideo]);
  };

  //Remove Image

  const removeImage = (img, index) => {
    setImagesToRemove((prevState) => [...prevState, img]);
    editDispatch({
      type: "REMOVE_IMAGE",
      payload: {
        index,
        id: img.id,
      },
    });
  };

  const removeVideo = (video, index) => {
    setRemovedVideo((prevState) => [...prevState, video]);
    editDispatch({
      type: "REMOVE_VIDEO",
      payload: {
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
        removeVideo,
        closeShopForm,
        control,
        getValues,
        mallTime,
        mallLevel,
        shopVideoState,
        shopVideoDispatch,
        videoUploadPercentage,
        isLoading,
      }}
    />
  );
};

export default ShopForm;
