import { MyContext } from "../App";
import { useHistory } from "react-router-dom";
import CommonForm from "../components/mall/CommonForm";
import reducer from "../reducers/reducer";
import { storage, fireStore } from "../firebase/config";
import shopImageReducer from "../reducers/shopImageReducer";
import React, { useState, useReducer, useContext } from "react";
import {
  checkMallValidation,
  checkShopValidation,
} from "../utils/checkValidation";

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

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    try {
      //mall validation
      const { isMallTimeError, isMallImageError } = checkMallValidation(
        state,
        mallImage
      );

      if (isMallTimeError) {
        dispatch({ type: "SET_MALLTIME_ERROR", payload: { isMallTimeError } });
      }

      if (isMallImageError) {
        alert("please upload mall image!");
        return;
      }

      //shop validation
      let isShopTimeError = false,
        isShopImageError = false;

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
          alert("please upload an image of shop no. " + index + 1);
          return;
        }
      });

      if (
        !isMallImageError &&
        !isMallTimeError &&
        !isShopTimeError &&
        !isShopImageError
      ) {
        setIsLoading(true);
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
        let shops = state?.shops?.map((s, i) => ({
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
        }));
        setLoadingPercentage(80);
        //FireStore
        fireStore
          .collection("Shopping Mall")
          .doc(state?.mallName)
          .set({
            ...mall,
            shops,
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
        history.goBack();
      }
    } catch (err) {
      alert("some error ocurred");
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
        mallImage,
        setMallImage,
        isLoading,
        setIsLoading,
        loadingPercentage,
      }}
    />
  );
};

export default MallForm;
