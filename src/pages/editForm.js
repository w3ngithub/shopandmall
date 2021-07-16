import CommonForm from "../components/mall/CommonForm";
import editReducer from "../reducers/editReducer";
import { useHistory, useLocation } from "react-router-dom";
import { storage, fireStore } from "../firebase/config";
import React, { useState, useReducer } from "react";
import addedShopImagesReducer from "../reducers/addedShopImagesReducer";
import { checkShopValidation } from "../utils/checkValidation";
import shopVideoReducer from "../reducers/shopVideoReducer";

const MallForm = () => {
  //Removed Images
  const [imagesToRemove, setImagesToRemove] = useState([]);
  //removed Video
  const [removedVideo, setRemovedVideo] = useState([]);

  const edit = true;

  const history = useHistory();
  const location = useLocation();
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  //States
  const [editData, editDispatch] = useReducer(editReducer, location.dataToSend);
  const [mallImage, setMallImage] = useState(null);
  const [shopVideoState, shopVideoDispatch] = useReducer(shopVideoReducer, []);

  //Added Images
  const shopImageValues = [];

  // console.log(location.dataToSend.shops, shopImageValues);
  const [addedShopImages, addedShopImagesDispatch] = useReducer(
    addedShopImagesReducer,
    shopImageValues
  );

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [videoUploadPercentage, setVideoUploadPercentage] = useState({});

  const submitHandler = async (e) => {
    try {
      let isShopTimeError = false,
        isShopImageError = false;
      editData.shops.forEach((shop, index) => {
        const { shopTimeError, shopImageError } = checkShopValidation(
          shop,
          shop.shopImages.length > 0 ? shop.shopImages : addedShopImages
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
      });

      if (!isShopTimeError && !isShopImageError) {
        const storageRef = storage.ref();
        let mallImageUrl = null;
        setIsLoading(true);

        // Mall Image
        if (mallImage !== null) {
          //delete old image
          setLoadingPercentage(30);
          storageRef
            .child(location.dataToSend.mallImage.imageName)
            .delete()
            .then("DELETED")
            .catch((err) => console.log(err));

          //get url of new image
          const imageRef = storageRef.child(mallImage.name);
          await imageRef.put(mallImage);
          mallImageUrl = await imageRef.getDownloadURL();
        } else {
          mallImageUrl = location.dataToSend.mallImage.imageUrl;
        }
        setLoadingPercentage(50);

        let shopImageUrl = null;

        if (addedShopImages.some((img) => img.hasOwnProperty("images"))) {
          console.log("addedshopimages");

          await Promise.all(
            addedShopImages.map((image) =>
              Promise.all(
                image.images.map((img) =>
                  storage.ref().child(img.name).put(img)
                )
              )
            )
          );

          shopImageUrl = await Promise.all(
            addedShopImages.map((image) =>
              Promise.all(
                image.images.map((img) =>
                  storage.ref(img.name).getDownloadURL()
                )
              )
            )
          );
          console.log(shopImageUrl);
        }

        setLoadingPercentage(60);

        // Remove Shop Images from Firebase Storage
        if (imagesToRemove.length > 0) {
          imagesToRemove.forEach((image) =>
            storage.ref().child(image.ImageName).delete()
          );
        }

        if (removedVideo.length > 0) {
          removedVideo.forEach((video) =>
            storage.ref().child(video.id).delete()
          );
        }

        let setMallImage = location.dataToSend.mallImage;
        if (mallImage) {
          setMallImage = {
            id: Math.random() + mallImage.name,
            imageName: mallImage.name,
            imageUrl: mallImageUrl,
          };
        }
        let shopVideoUrl = [];
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
        }

        let mall = {
          mallName: editData?.mallName,
          mallAddress: editData?.mallAddress,
          levels: editData?.levels,
          phoneNumber: editData?.phoneNumber,
          timings: editData?.timings,
          mallImage: setMallImage,
        };

        let shops = [];

        editData?.shops?.forEach((s, i) => {
          const isShopImagesPresent = s.shopImages.length > 0;
          const isNewShopImagesAdded = shopImageUrl !== null;
          const indexOfAddedImages = addedShopImages.findIndex(
            (image) => image.id === i
          );
          const indexOfVideo = shopVideoState.findIndex(
            (video) => video.id === i
          );
          const isNewVideo = indexOfVideo >= 0;

          const shop =
            isShopImagesPresent && isNewShopImagesAdded
              ? {
                  id: i,
                  shopName: s.shopName,
                  shopDescription: s.shopDescription,
                  shopLevel: s?.shopLevel,
                  shopPhoneNumber: s?.shopPhoneNumber,
                  timings: s?.timings,
                  category: s?.category,
                  subCategory: s?.subCategory,
                  shopImages: [
                    ...s.shopImages,
                    ...shopImageUrl[indexOfAddedImages].map((items, index) => ({
                      id:
                        Math.random() +
                        addedShopImages[indexOfAddedImages].images[index].name,
                      ImageName:
                        addedShopImages[indexOfAddedImages].images[index].name,
                      url: items,
                    })),
                  ],
                }
              : isShopImagesPresent
              ? {
                  id: i,
                  shopName: s.shopName,
                  shopDescription: s.shopDescription,
                  shopLevel: s?.shopLevel,
                  shopPhoneNumber: s?.shopPhoneNumber,
                  timings: s?.timings,
                  category: s?.category,
                  subCategory: s?.subCategory,
                  shopImages: [...s.shopImages],
                }
              : {
                  id: i,
                  shopName: s.shopName,
                  shopDescription: s.shopDescription,
                  shopLevel: s?.shopLevel,
                  shopPhoneNumber: s?.shopPhoneNumber,
                  timings: s?.timings,
                  category: s?.category,
                  subCategory: s?.subCategory,
                  shopImages: [
                    ...shopImageUrl[indexOfAddedImages].map((items, index) => ({
                      id:
                        Math.random() +
                        addedShopImages[indexOfAddedImages].images[index].name,
                      ImageName:
                        addedShopImages[indexOfAddedImages].images[index].name,
                      url: items,
                    })),
                  ],
                };

          if (isNewVideo) {
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
          .doc(location.dataToSend.mallName)
          .delete()
          .then(() => console.log("DELETED"))
          .catch((err) => console.log(err));
        fireStore
          .collection("Shopping Mall")
          .doc(editData.mallName)
          .set({
            ...mall,
            shops: shops,
          });
        setLoadingPercentage(100);
        history.push("/admin/malls");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <CommonForm
      {...{
        edit,
        editDispatch,
        editData,
        loadingPercentage,
        submitHandler,
        setImagesToRemove,
        setRemovedVideo,
        addedShopImagesDispatch,
        shopVideoState,
        shopVideoDispatch,
        addedShopImages,
        mallImage,
        setMallImage,
        isLoading,
        setIsLoading,
        videoUploadPercentage,
      }}
    />
  );
};

export default MallForm;
