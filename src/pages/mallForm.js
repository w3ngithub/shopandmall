import { MyContext } from "../App";
import { useHistory } from "react-router-dom";
import CommonForm from "../components/mall/CommonForm";
import reducer from "../reducers/reducer";
import { storage, fireStore } from "../firebase/config";
import shopImageReducer from "../reducers/shopImageReducer";
import shopVideoReducer from "../reducers/shopVideoReducer";
import React, { useState, useReducer, useContext } from "react";
import {
  checkMallValidation,
  checkShopValidation,
} from "../utils/checkValidation";
import { ToastContainer, toast, Slide } from "react-toastify";

const MallForm = () => {
  const { allDataDispatch } = useContext(MyContext);

  const edit = false;

  const history = useHistory();

  const initialValues = {
    mallName: "",
    mallAddress: "",
    levels: "",
    phoneNumber: "",
    mallUrl: {},
    shops: [],
    timings: [{ id: 1, label: "Everyday" }, { id: 2 }],
    mallTimeError: false,
  };

  const shopImageValues = [{ id: 0, images: [] }];

  //States
  const [state, dispatch] = useReducer(reducer, initialValues);
  const [mallImage, setMallImage] = useState(null);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  //Shop States
  const [shopImageState, shopImageDispatch] = useReducer(
    shopImageReducer,
    shopImageValues
  );

  const [shopVideoState, shopVideoDispatch] = useReducer(shopVideoReducer, []);

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [videoUploadPercentage, setVideoUploadPercentage] = useState({});

  const successNotification = () =>
    toast.success("Successfull Saved!", {
      position: "bottom-right",
      autoClose: 2000,
      onClose: () => history.goBack(),
    });

  const submitHandler = async (e) => {
    try {
      // mall validation
      const { isMallTimeError, isMallImageError } = checkMallValidation(
        state,
        mallImage
      );
      const arrayOfOpenTime = state.timings[0].openTime.split(":");
      const arrayOfCloseTime = state.timings[0].closeTime.split(":");
      const mallTimings = {
        openTime:
          parseInt(arrayOfOpenTime[0], 10) * 60 * 60 +
          parseInt(arrayOfOpenTime[1], 10) * 60,
        closeTime:
          parseInt(arrayOfCloseTime[0], 10) * 60 * 60 +
          parseInt(arrayOfCloseTime[1], 10) * 60,
      };

      if (mallTimings.closeTime - mallTimings.openTime < 5400) {
        alert("mall close time should be at least 1hr 30min after open time");
        return;
      }

      if (isMallTimeError) {
        dispatch({ type: "SET_MALLTIME_ERROR", payload: { isMallTimeError } });
      }

      if (isMallImageError) {
        alert("please upload mall image!");
        return;
      }

      //shop validation
      let isShopTimeError = false,
        isShopImageError = false,
        isVideoThumbnailError = false;

      if (state.shops.length === 0) {
        alert("please add at least one shop");
        return;
      }

      state.shops.forEach((shop, index) => {
        const { shopTimeError, shopImageError } = checkShopValidation(
          shop,
          shopImageState[index].images
        );
        if (shopTimeError) {
          isShopTimeError = true;
          alert(`please fill the time of shop no.${index + 1}`);
          return;
        }

        if (shopImageError) {
          isShopImageError = true;
          alert(`please upload an image of shop no.${index + 1}`);
          return;
        }

        if (
          shopVideoState.length > 0 &&
          shopVideoState[index].thumbnail === undefined
        ) {
          isVideoThumbnailError = true;
          alert(`please upload video thumbnail of shop no. ${index + 1}`);
          return;
        }
      });

      if (
        !isMallImageError &&
        !isMallTimeError &&
        !isShopTimeError &&
        !isShopImageError &&
        !isVideoThumbnailError
      ) {
        setIsLoading(true);

        const storageRef = storage.ref();
        let mallImageUrl = null;
        setLoadingPercentage(10);
        // Mall Image
        if (mallImage !== null) {
          const imageRef = storageRef.child(mallImage.name);
          setLoadingPercentage(25);
          await imageRef.put(mallImage);
          setLoadingPercentage(45);
          mallImageUrl = await imageRef.getDownloadURL();
        } else {
          mallImageUrl = null;
        }
        setLoadingPercentage(60);

        await Promise.all(
          shopImageState?.map((item) =>
            Promise.all(
              item?.images?.map((image) =>
                storage.ref().child(image.name).put(image)
              )
            )
          )
        );
        const shopImageUrl = await Promise.all(
          shopImageState?.map((item) =>
            Promise.all(
              item?.images?.map((image) =>
                storage.ref(image.name).getDownloadURL()
              )
            )
          )
        );

        let shopVideoUrl = [],
          videoThumbnailUrl = [];

        if (shopVideoState.length > 0) {
          await Promise.all(
            shopVideoState.map(({ id, video, uniqueId }) => {
              const uploadTask = storage
                .ref()
                .child(uniqueId + video.name)
                .put(video);
              uploadTask.on("state_changed", (snapshot) => {
                var progress = Math.floor(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setVideoUploadPercentage((prevState) => ({
                  ...prevState,
                  [id]: progress,
                }));
              });
              return uploadTask;
            })
          );
          setLoadingPercentage(80);
          shopVideoUrl = await Promise.all(
            shopVideoState.map(({ id, video, uniqueId }) =>
              storage.ref(uniqueId + video.name).getDownloadURL()
            )
          );

          await Promise.all(
            shopVideoState?.map((item) =>
              storage
                .ref()
                .child(item.thumbnail.id + item.thumbnail.thumbnail.name)
                .put(item.thumbnail.thumbnail)
            )
          );
          setLoadingPercentage(90);
          videoThumbnailUrl = await Promise.all(
            shopVideoState?.map((item) =>
              storage
                .ref(item.thumbnail.id + item.thumbnail.thumbnail.name)
                .getDownloadURL()
            )
          );
        }

        let mall = {
          mallId: Math.random() * 9999,
          mallName: state?.mallName,
          mallAddress: state?.mallAddress,
          levels: state?.levels,
          phoneNumber: state?.phoneNumber,
          timings: state?.timings,
          mallImage: {
            id: Math.random() + mallImage?.name,
            imageName: mallImage?.name,
            imageUrl: mallImageUrl,
          },
        };
        let shops = [];
        state?.shops?.forEach((s, i) => {
          const indexOfVideo = shopVideoState.findIndex(
            (video) => video.id === i
          );
          const isVideoPresent = indexOfVideo >= 0;
          const shop = {
            id: i,
            shopName: s?.shopName,
            shopDescription: s?.shopDescription,
            shopLevel: s?.shopLevel,
            shopPhoneNumber: s?.shopPhoneNumber,
            timings: s?.timings,
            category: s?.category,
            subCategory: s?.subCategory,
            shopImages: shopImageUrl[i]?.map((items, index) => ({
              id: Math.random() + shopImageState[i]?.images[index]?.name,
              ImageName: shopImageState[i]?.images[index]?.name,
              url: items,
            })),
          };

          if (isVideoPresent) {
            shops = [
              ...shops,
              {
                ...shop,
                shopVideo: {
                  id:
                    shopVideoState[indexOfVideo].uniqueId +
                    shopVideoState[indexOfVideo].video.name,
                  url: shopVideoUrl[indexOfVideo],
                  videoName: shopVideoState[indexOfVideo].video.name,
                  thumbnail: {
                    id:
                      shopVideoState[indexOfVideo].thumbnail.id +
                      shopVideoState[indexOfVideo].thumbnail.thumbnail.name,
                    thumbnail: videoThumbnailUrl[indexOfVideo],
                    name: shopVideoState[indexOfVideo].thumbnail.thumbnail.name,
                  },
                },
              },
            ];
          } else {
            shops = [...shops, shop];
          }
        });

        //FireStore
        fireStore
          .collection("Shopping Mall")
          .doc(state?.mallName)
          .set({
            ...mall,
            shops,
          })
          .then(() => {
            successNotification();
          });
        dispatch({
          type: "ADD_IMAGE_URLS",
          payload: { mallImageUrl, shops, mallImage },
        });
        allDataDispatch({
          type: "ADD_DATA",
          payload: { mall, shops },
        });
        setLoadingPercentage(100);
      }
    } catch (err) {
      alert(err);
      setIsLoading(false);
    }
  };

  //Add New Shop Form
  const newShopForm = () => {
    dispatch({ type: "ADD_SHOP_FORM", payload: { ind: Math.random() } });
  };

  return (
    <CommonForm
      {...{
        edit,
        dispatch,
        state,
        submitHandler,
        newShopForm,
        shopImageState,
        shopImageDispatch,
        shopVideoState,
        shopVideoDispatch,
        mallImage,
        setMallImage,
        isLoading,
        setIsLoading,
        loadingPercentage,
        videoUploadPercentage,
        ToastContainer,
      }}
    />
  );
};

export default MallForm;
