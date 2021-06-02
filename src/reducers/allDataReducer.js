const allDataReducer = (state, action) => {
  switch (action.type) {
    case "ADD_DATA":
      return [
        ...state,
        {
          ...action.payload.mall,
          shops: [action.payload.shops],
        },
      ];
    default:
      return state;
  }
};

export default allDataReducer;
