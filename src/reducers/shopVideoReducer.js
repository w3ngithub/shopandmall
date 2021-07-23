const shopVideoReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return state.find((video) => video.id === action.payload.index)
        ? [
            ...state.map((video) =>
              video.id === action.payload.index
                ? { ...video, video: action.payload.video }
                : video
            ),
          ]
        : [
            ...state,
            {
              id: action.payload.index,
              video: action.payload.video,
              uniqueId: Date.now(),
            },
          ];
    case "REMOVE":
      return [...state.filter((video) => video.id !== action.index)];

    case "ADD_THUMBNAIL":
      return [
        ...state.map((video) =>
          video.id === action.payload.index
            ? { ...video, thumbnail: action.payload.thumbnail }
            : video
        ),
      ];
    default:
      return state;
  }
};

export default shopVideoReducer;
