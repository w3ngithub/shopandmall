
const addedShopImagesReducer = (state,action) => {
  switch (action.type) {
    case "ADD":
      const newArray = state.map((item) =>
        item.id === action.payload.index
          ? {
              ...item,
              images: [...item.images, action.payload.selectedShopImages],
            }
          : item
      );
      const isShopPresent = newArray.find((x) => x.id === action.payload.index);
      const finalArray = isShopPresent
        ? newArray
        : [
            ...newArray,
            {
              id: action.payload.index,
              images: [action.payload.selectedShopImages],
            },
          ];
      return finalArray;

    case "REMOVE_IMAGE":
      return [
        ...state.map((item, ind) =>
          ind === action.payload.outerIndex
            ? {
                ...item,
                images: item.images.filter(
                  (i) => i.name !== action.payload.name
                ),
              }
            : item
        ),
      ];

    default:
      return state;
  }
};

export default addedShopImagesReducer;
