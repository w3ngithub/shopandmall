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
            shopLevel: "",
            shopPhoneNumber: "",
            shopDescription: "",
            timings: [{ id: 1, label: "Everyday" }, { id: 2 }],
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
        shops: [
          ...state.shops.map((shop, i) =>
            i === action.payload.index
              ? { ...shop, [action.payload.name]: action.payload.value }
              : shop
          ),
        ],
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

    case "ADD_TIMINGS":
      return {
        ...state,
        timings: [
          {
            ...state?.timings[0],
            label: "Everyday",
            [action.payload.name]: action.payload.value,
          },
        ],
      };

    case "ADD_TIMINGS_MANUALLY":
      return {
        ...state,
        timings: [
          ...state.timings.map((data) =>
            data.id === action.payload.rowId
              ? { ...data, [action.payload.name]: action.payload.value }
              : data
          ),
        ],
      };

    case "ADD_TIMINGS_FIELDS":
      return {
        ...state,
        timings: [...state.timings, { id: Date.now() }],
      };

    case "REMOVE_TIMINGS_FIELDS":
      return {
        ...state,
        timings: [
          ...state.timings.filter((time) => time.id !== action.payload.rowId),
        ],
      };

    case "ADD_SHOPTIMINGS_FIELDS":
      return {
        ...state,
        shops: [
          ...state.shops.map((shop, i) =>
            i === action.payload.index
              ? { ...shop, timings: [...shop.timings, { id: Date.now() }] }
              : shop
          ),
        ],
      };

    case "REMOVE_SHOPTIMINGS_FIELDS":
      return {
        ...state,
        shops: [
          ...state.shops.map((shop, i) =>
            i === action.payload.shopIndex
              ? {
                  ...shop,
                  timings: [
                    ...shop.timings.filter(
                      (time) => time.id !== action.payload.rowId
                    ),
                  ],
                }
              : shop
          ),
        ],
      };

    case "ADD_SHOP_TIMINGS":
      return {
        ...state,
        shops: [
          ...state.shops.map((shop, index) =>
            index === action.payload.index
              ? {
                  ...shop,
                  timings: [
                    {
                      ...shop.timings[0],
                      label: "Everyday",
                      [action.payload.name]: action.payload.value,
                    },
                  ],
                }
              : shop
          ),
        ],
      };

    case "ADD_SHOP_TIMINGS_MANUALLY":
      return {
        ...state,
        shops: [
          ...state.shops.map((shop, index) =>
            index === action.payload.shopIndex
              ? {
                  ...shop,
                  timings: [
                    ...shop.timings.map((data) =>
                      data.id === action.payload.rowId
                        ? {
                            ...data,
                            [action.payload.name]: action.payload.value,
                          }
                        : data
                    ),
                  ],
                }
              : shop
          ),
        ],
      };

    case "SET_MALLTIME_ERROR":
      return {
        ...state,
        mallTimeError: action.payload.isMallTimeError,
      };

    default:
      return state;
  }
};

export default reducer;
