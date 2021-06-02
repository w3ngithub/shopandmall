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
