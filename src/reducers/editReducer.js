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
        shops: state.shops.map((shop, i) =>
          i === action.payload.index
            ? { ...shop, [action.payload.name]: action.payload.value }
            : shop
        ),
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
      console.log(action.payload);
      return {
        ...state,
        shops: state.shops.map((shop, i) =>
          i === action.payload.index
            ? {
                ...shop,
                shopImages: shop.shopImages.filter(
                  (s) => s.ImageName !== action.payload.img.ImageName
                ),
              }
            : shop
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
