import { MyContext } from "../../App";
import { useHistory } from "react-router-dom";
import CommonForm from "./CommonForm";
import reducer from "../../reducers/reducer";
import { storage, fireStore } from "../../firebase/config";
import shopImageReducer from "../../reducers/shopImageReducer";
import React, { useState, useReducer, useContext } from "react";

const MallForm = () => {
  const { allDataDispatch } = useContext(MyContext);

  const edit = false;

  const history = useHistory();

  const initialValues = {
    mallName: "",
    mallAddress: "",
    mallUrl: {},
    shops: [],
  };

  const shopImageValues = [{ id: 0, images: [] }];

  //States
  const [state, dispatch] = useReducer(reducer, initialValues);
  const [mallImage, setMallImage] = useState(null);

  //Shop States
  const [shopImageState, shopImageDispatch] = useReducer(
    shopImageReducer,
    shopImageValues
  );

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const storageRef = storage.ref();
      let mallImageUrl = null;

      //Mall Image
      if (mallImage !== null) {
        const imageRef = storageRef.child(mallImage.name);
        await imageRef.put(mallImage);
        mallImageUrl = await imageRef.getDownloadURL();
      } else {
        mallImageUrl = null;
      }

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
        shopImages: shopImageUrl[i]?.map((items, index) => ({
          id: Math.random() + shopImageState[i]?.images[index]?.name,
          ImageName: shopImageState[i]?.images[index]?.name,
          url: items,
        })),
      }));

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

      history.goBack();
    } catch (err) {
      console.log("Error", err);
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
      }}
    />
  );
};

export default MallForm;
