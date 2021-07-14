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
      }}
    />
  );
};

export default ShopForm;
