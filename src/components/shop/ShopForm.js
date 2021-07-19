import React from "react";
import CommomShopForm from "./CommonShopForm";

const ShopForm = ({
  edit,
  s,
  dispatch,
  index,
  shopImageState,
  shopImageDispatch,
  shopVideoState,
  shopVideoDispatch,
  register,
  errors,
  control,
  mallTime,
  mallLevel,
  videoUploadPercentage,
  isLoading,
}) => {
  const closeShopForm = () => {
    dispatch({
      type: "REMOVE_SHOP_FORM",
      payload: {
        s,
      },
    });
  };

  return (
    <CommomShopForm
      {...{
        edit,
        s,
        dispatch,
        index,
        shopImageState,
        shopImageDispatch,
        shopVideoState,
        shopVideoDispatch,
        closeShopForm,
        control,
        mallTime,
        mallLevel,
        videoUploadPercentage,
        isLoading,
      }}
    />
  );
};

export default ShopForm;
