// import React from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_MALL_INFO":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };

    case "ADD_MALL_IMAGE":
      return {
        ...state,
        mallUrl: action.payload.selected,
      };

    case "ADD_SHOP_FORM":
      return {
        ...state,
        shops: [
          ...state.shops,
          {
            id: action.payload.ind,
            shopName: "",
            shopDescription: "",
            shopUrl: [],
          },
        ],
      };

    case "REMOVE_SHOP_FORM":
      return {
        ...state,
        shops: state.shops.filter((shop) => shop.id !== action.payload.s.id),
      };

    case "ADD_SHOP_INFO":
      return {
        ...state,
        shops: state.shops.map((shop, i) =>
          i === action.payload.index
            ? { ...shop, [action.payload.name]: action.payload.value }
            : shop
        ),
      };

    case "ADD_SHOP_IMAGES":
      return {
        ...state,
        shops: state.shops.map((shop, i) =>
          i === action.payload.index
            ? {
                ...shop,
                shopUrl: [...shop.shopUrl, action.payload.selectedShopImages],
              }
            : shop
        ),
      };

    case "ADD_IMAGE_URLS":
      return {
        ...state,
        mallUrl: action.payload.mallImageUrl,
        shops: action.payload.shops,
      };

    case "RESET_FORM":
      return {
        state: action.payload.initialValues,
      };

    default:
      return state;
  }
};

export default reducer;
