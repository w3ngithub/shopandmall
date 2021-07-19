const editReducer = (state, action) => {
  switch (action.type) {
    case "EDIT_MALL_INFO":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };

    case "EDIT_SHOP_INFO":
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

    case "EDIT_SHOP_TIMINGS":
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
                      [action.payload.name]: action.payload.value,
                    },
                  ],
                }
              : shop
          ),
        ],
      };

    case "ADD_TIMINGS_FIELDS":
      return {
        ...state,
        timings: [...state.timings, { id: Date.now() }],
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

    case "REMOVE_TIMINGS_FIELDS":
      return {
        ...state,
        timings: [
          ...state.timings.filter((time) => time.id !== action.payload.rowId),
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

    case "REMOVE_SHOP_FORM":
      return {
        ...state,
        shops: state.shops.filter(
          (shop) => shop.id !== action.payload.dataShop.id
        ),
      };

    case "REMOVE_IMAGE":
      return {
        ...state,
        shops: state.shops.map((shop, i) =>
          i === action.payload.index
            ? {
                ...shop,
                shopImages: shop.shopImages.filter(
                  (s) => s.id !== action.payload.id
                ),
              }
            : shop
        ),
      };

    case "REMOVE_VIDEO":
      return {
        ...state,
        shops: state.shops.map((shop, i) =>
          i === action.payload.index ? { ...shop, shopVideo: null } : shop
        ),
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
            shopImages: [],
          },
        ],
      };

    default:
      return state;
  }
};

export default editReducer;
