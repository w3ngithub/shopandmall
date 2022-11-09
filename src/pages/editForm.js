/* eslint-disable */
import editReducer from "../reducers/editReducer";
import React, { useState, useReducer, useEffect } from "react";
import CommonForm from "../components/mall/CommonForm";
import { ToastContainer, toast } from "react-toastify";
import { storage, fireStore } from "../firebase/config";
import { useHistory, useLocation, useParams } from "react-router-dom";
import shopVideoReducer from "../reducers/shopVideoReducer";
import {
  checkMallValidation,
  checkShopValidation,
} from "../utils/checkValidation";
import addedShopImagesReducer from "../reducers/addedShopImagesReducer";

const MallForm = () => {
  //Removed Images
  const [imagesToRemove, setImagesToRemove] = useState([]);
  //removed Video
  const [removedVideo, setRemovedVideo] = useState([]);
  const [initialEditData, setInitial] = useState({});

  const edit = true;

  const history = useHistory();
  const location = useLocation();
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  //States
  const [Loading, setLoading] = useState(true);
  const [editData, editDispatch] = useReducer(editReducer, initialEditData);
  const [mallImage, setMallImage] = useState(null);
  const [shopVideoState, shopVideoDispatch] = useReducer(shopVideoReducer, []);
  const [removedVideoThumbnail, setRemovedVideoThumbnail] = useState([]);
  const [videoThumbnail, setVideoThumbnail] = useState({});

  //Added Images
  const shopImageValues = [];

  const [addedShopImages, addedShopImagesDispatch] = useReducer(
    addedShopImagesReducer,
    shopImageValues
  );

  //id from the params
  const { mallId } = useParams();

  //getting the edit form data
  useEffect(() => {
    function getData() {
      setLoading(true);
      fireStore
        .collection("Shopping Mall")
        .doc(mallId)
        .get()
        .then((doc) => {
          // console.log("Doc info", doc.data());
          editDispatch({ type: "ADD_EDIT_MALL", payload: doc.data() });
          setLoading(false);
        })
        .catch((error) => console.log(error));
    }
    getData();
  }, [mallId]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [videoUploadPercentage, setVideoUploadPercentage] = useState({});

  const successNotification = () =>
    toast.success("Successfully Updated!", {
      position: "bottom-right",
      autoClose: 2000,
      onClose: () => history.push(`/admin/malls/${editData.mallName}`),
    });
  const submitHandler = async (e) => {
    try {
      // mall validation
      const { isMallTimeError, isMallImageError } = checkMallValidation(
        editData,
        editData.mallImage
      );

      if (isMallTimeError) {
        alert("Please fill up the mall time");
        return;
      }

      if (isMallImageError) {
        alert("Please upload mall image!");
        return;
      }

      const arrayOfOpenTime = editData.timings[0]?.openTime?.split(":");
      const arrayOfCloseTime = editData.timings[0]?.closeTime?.split(":");
      const mallTimings = {
        openTime:
          parseInt(arrayOfOpenTime[0], 10) * 60 * 60 +
          parseInt(arrayOfOpenTime[1], 10) * 60,
        closeTime:
          parseInt(arrayOfCloseTime[0], 10) * 60 * 60 +
          parseInt(arrayOfCloseTime[1], 10) * 60,
      };

      if (mallTimings.closeTime - mallTimings.openTime < 0) {
        alert("Please enter a valid time from 6:00 am to 11:00 pm");
        throw new Error("Please enter a valid time from 6:00 am to 11:00 pm");
      }

      if (Math.abs(mallTimings.closeTime - mallTimings.openTime) < 5400) {
        alert("Mall's close time should be at least 1hr 30min after open time");
        return;
      }
      //shop validation
      let isShopTimeError = false,
        isShopImageError = false;

      editData.shops.forEach((shop, index) => {
        const { shopTimeError, shopImageError } = checkShopValidation(
          shop,
          shop?.shopImages?.length > 0 ? shop.shopImages : addedShopImages
        );

        if (shopTimeError) {
          isShopTimeError = true;
          alert(`Please fill the time of shop no.${index + 1}`);
          return;
        }
        if (shopImageError) {
          isShopImageError = true;
          alert(`Please upload an image of shop no.${index + 1}`);
          return;
        }

        const arrayOfOpenTime = shop.timings[0]?.openTime?.split(":");
        const arrayOfCloseTime = shop.timings[0]?.closeTime?.split(":");

        const shopTimings = {
          openTime:
            parseInt(arrayOfOpenTime[0], 10) * 60 * 60 +
            parseInt(arrayOfOpenTime[1], 10) * 60,
          closeTime:
            parseInt(arrayOfCloseTime[0], 10) * 60 * 60 +
            parseInt(arrayOfCloseTime[1], 10) * 60,
        };

        if (shopTimings.closeTime - shopTimings.openTime < 0) {
          alert("Please enter a valid time from 6:00 am to 11:00 pm");
          throw new Error("Please enter a valid time from 6:00 am to 11:00 pm");
        }

        if (Math.abs(shopTimings.closeTime - shopTimings.openTime) < 5400) {
          alert(
            "Shop's close time should be at least 1hr 30min after open time. Shop No. " +
              (index + 1)
          );
          throw new Error(
            "Gap of opening and closing time should be atleast 1hr 30 mins"
          );
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
            .child(editData.mallImage.imageName)
            .delete()
            .then("DELETED")
            .catch((err) => console.log(err));

          //get url of new image
          const imageRef = storageRef.child(mallImage.name);
          await imageRef.put(mallImage);
          mallImageUrl = await imageRef.getDownloadURL();
        } else {
          mallImageUrl = editData.mallImage.imageUrl;
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

        let setMallImage = editData.mallImage;
        if (mallImage) {
          setMallImage = {
            id: Date.now() + mallImage.name,
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
                .child(video.id + video.name)
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
          mallId: editData?.mallId,
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
                    subCategory: s?.subCategory ?? "",

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
        // console.log("editData: ", editData);
        // console.log("mall: ", mall);
        fireStore
          .collection("Shopping Mall")
          // .doc(editData.mallName) //Mall name gets updated so it doesn't delete
          .doc(mallId)
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

  if (Loading) {
    return <h1>Loading.....</h1>;
  }

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
