export const checkMallValidation = (state, image) => {
  let isMallTimeError = false;

  //check for empty time
  isMallTimeError = !state.timings.every(
    (time) =>
      time.hasOwnProperty("openTime") &&
      time.hasOwnProperty("closeTime") &&
      time.hasOwnProperty("label")
  );

  //check for empty image
  const isMallImageError = image === null;

  return { isMallTimeError, isMallImageError };
};

export const checkShopValidation = (state, image) => {
  let shopTimeError = false;

  //check for empty time
  shopTimeError = !state.timings.every(
    (time) =>
      time.hasOwnProperty("openTime") &&
      time.hasOwnProperty("closeTime") &&
      time.hasOwnProperty("label")
  );

  //check for empty image
  const shopImageError =
    image?.images?.length === 0 || typeof image === "undefined";

  return { shopTimeError, shopImageError };
};
