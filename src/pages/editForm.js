import editReducer from "../reducers/editReducer";
import React, { useState, useReducer } from "react";
import CommonForm from "../components/mall/CommonForm";
import { ToastContainer, toast } from "react-toastify";
import { storage, fireStore } from "../firebase/config";
import { useHistory, useLocation } from "react-router-dom";
import shopVideoReducer from "../reducers/shopVideoReducer";
import { checkShopValidation } from "../utils/checkValidation";
import addedShopImagesReducer from "../reducers/addedShopImagesReducer";

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
  const [removedVideoThumbnail, setRemovedVideoThumbnail] = useState([]);
  const [videoThumbnail, setVideoThumbnail] = useState({});

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

  const successNotification = () =>
    toast.success("Successfull Updated!", {
      position: "bottom-right",
      autoClose: 2000,
      onClose: () => history.push(`/admin/malls/${editData.mallName}`),
    });

  const submitHandler = async (e) => {
    try {
      let isShopTimeError = false,
        isShopImageError = false;

      editData.shops.forEach((shop, index) => {
        const { shopTimeError, shopImageError } = checkShopValidation(
          shop,
          shop?.shopImages?.length > 0 ? shop.shopImages : addedShopImages
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

        const arrayOfOpenTime = shop.timings[0]?.openTime?.split(":");
        const arrayOfCloseTime = shop.timings[0]?.closeTime?.split(":");

        const mallTimings = {
          openTime:
            parseInt(arrayOfOpenTime[0], 10) * 60 * 60 +
            parseInt(arrayOfOpenTime[1], 10) * 60,
          closeTime:
            parseInt(arrayOfCloseTime[0], 10) * 60 * 60 +
            parseInt(arrayOfCloseTime[1], 10) * 60,
        };

        if (mallTimings.closeTime - mallTimings.openTime < 5400) {
          alert(
            "shop close time should be at least 1hr 30min after open time. Shop No. " +
              (index + 1)
          );
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
          await Promise.all(
            addedShopImages.map((image) =>
              Promise.all(
                image.images.map((img) =>
                  storage
                    .ref()
                    .child(img.id + img.image.name)
                    .put(img.image)
                )
              )
            )
          );

          shopImageUrl = await Promise.all(
            addedShopImages.map((image) =>
              Promise.all(
                image.images.map((img) =>
                  storage.ref(img.id + img.image.name).getDownloadURL()
                )
              )
            )
          );
        }

        setLoadingPercentage(60);

        // Remove Shop Images from Firebase Storage
        if (imagesToRemove.length > 0) {
          imagesToRemove.forEach((image) =>
            storage.ref().child(image.id).delete()
          );
        }

        if (removedVideo.length > 0) {
          removedVideo.forEach((video) =>
            storage.ref().child(video?.id).delete()
          );
        }

        if (removedVideoThumbnail.length > 0) {
          removedVideoThumbnail.forEach((id) =>
            storage.ref().child(id).delete()
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
          setLoadingPercentage(70);
          shopVideoUrl = await Promise.all(
            shopVideoState.map(({ id, video, uniqueId }) =>
              storage.ref(uniqueId + video.name).getDownloadURL()
            )
          );
        }
        let tempVideos = [];

        if (videoThumbnail !== {}) {
          for (const index in videoThumbnail) {
            tempVideos = [
              ...tempVideos,
              {
                id: videoThumbnail[index].id,
                index,
                thumbnail: videoThumbnail[index].thumbnail,
              },
            ];
          }

          await Promise.all(
            tempVideos.map((image) =>
              storage.ref(image.id + image.thumbnail.name).put(image.thumbnail)
            )
          );
          setLoadingPercentage(80);
          videoThumbnailUrl = await Promise.all(
            tempVideos.map((image) =>
              storage.ref(image.id + image.thumbnail.name).getDownloadURL()
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

        if (editData?.shops?.length > 0) {
          editData?.shops?.forEach((s, i) => {
            const isShopImagesPresent = s?.shopImages?.length > 0;
            const isNewShopImagesAdded =
              addedShopImages.findIndex((image) => image.id === i) >= 0;
            const indexOfAddedImages = addedShopImages.findIndex(
              (image) => image.id === i
            );
            const indexOfVideo = shopVideoState.findIndex(
              (video) => video.id === i
            );
            const isNewVideo = indexOfVideo >= 0;

            let shop =
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
                      ...shopImageUrl[indexOfAddedImages].map(
                        (items, index) => ({
                          id:
                            addedShopImages[indexOfAddedImages].images[index]
                              .id +
                            addedShopImages[indexOfAddedImages].images[index]
                              .image.name,
                          ImageName:
                            addedShopImages[indexOfAddedImages].images[index]
                              .image.name,
                          url: items,
                        })
                      ),
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
                      ...shopImageUrl[indexOfAddedImages].map(
                        (items, index) => ({
                          id:
                            addedShopImages[indexOfAddedImages].images[index]
                              .id +
                            addedShopImages[indexOfAddedImages].images[index]
                              .image.name,
                          ImageName:
                            addedShopImages[indexOfAddedImages].images[index]
                              .image.name,
                          url: items,
                        })
                      ),
                    ],
                  };

            if (s.shopVideo !== undefined) {
              shop = { ...shop, shopVideo: s.shopVideo };
            }

            if (isNewVideo) {
              shop = {
                ...shop,
                shopVideo: {
                  id:
                    shopVideoState[indexOfVideo].uniqueId +
                    shopVideoState[indexOfVideo].video.name,
                  url: shopVideoUrl[indexOfVideo],
                  videoName: shopVideoState[indexOfVideo].video.name,
                },
              };
            }
            shops = [...shops, { ...shop }];
            if (videoThumbnail.hasOwnProperty(i)) {
              const ind = tempVideos.findIndex((v) => +v.index === i);
              shops = [
                ...shops.map((s, index) =>
                  index === i
                    ? {
                        ...shop,
                        shopVideo: {
                          ...shop.shopVideo,
                          thumbnail: {
                            id:
                              videoThumbnail[i].id +
                              videoThumbnail[i].thumbnail.name,
                            name: videoThumbnail[i].thumbnail.name,
                            thumbnail: videoThumbnailUrl[ind],
                          },
                        },
                      }
                    : s
                ),
              ];
            }
          });
        }

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
          })
          .then(() => {
            successNotification();
          });
        setLoadingPercentage(100);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const newShopForm = () => {
    editDispatch({ type: "ADD_SHOP_FORM", payload: { ind: Math.random() } });
  };

  return (
    <CommonForm
      {...{
        edit,
        editDispatch,
        editData,
        newShopForm,
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
        ToastContainer,
        setRemovedVideoThumbnail,
        setVideoThumbnail,
        videoThumbnail,
      }}
    />
  );
};

export default MallForm;
