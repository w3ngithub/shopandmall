import CommonForm from "../components/mall/CommonForm";
import editReducer from "../reducers/editReducer";
import { useHistory, useLocation } from "react-router-dom";
import { storage, fireStore } from "../firebase/config";
import React, { useState, useReducer } from "react";
import addedShopImagesReducer from "../reducers/addedShopImagesReducer";
import { checkShopValidation } from "../utils/checkValidation";

const MallForm = () => {
  //Removed Images
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const edit = true;

  const history = useHistory();
  const location = useLocation();
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  //States
  const [editData, editDispatch] = useReducer(editReducer, location.dataToSend);
  const [mallImage, setMallImage] = useState(null);

  //Added Images
  const shopImageValues = [];

  // console.log(location.dataToSend.shops, shopImageValues);
  const [addedShopImages, addedShopImagesDispatch] = useReducer(
    addedShopImagesReducer,
    shopImageValues
  );

  //Loading
  const [isLoading, setIsLoading] = useState(false);

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
        imagesToRemove.forEach((image) =>
          storage.ref().child(image.ImageName).delete()
        );

        let setMallImage = location.dataToSend.mallImage;
        if (mallImage) {
          setMallImage = {
            id: Math.random() + mallImage.name,
            imageName: mallImage.name,
            imageUrl: mallImageUrl,
          };
        }

        let mall = {
          mallName: editData?.mallName,
          mallAddress: editData?.mallAddress,
          levels: editData?.levels,
          phoneNumber: editData?.phoneNumber,
          timings: editData?.timings,
          mallImage: setMallImage,
        };

        let shops = editData?.shops?.map((s, i) =>
          s.shopImages
            ? shopImageUrl[addedShopImages.findIndex((image) => image.id === i)]
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
                    ...shopImageUrl[
                      addedShopImages.findIndex((image) => image.id === i)
                    ].map((items, index) => ({
                      id:
                        Math.random() +
                        addedShopImages[
                          addedShopImages.findIndex((image) => image.id === i)
                        ].images[index].name,
                      ImageName:
                        addedShopImages[
                          addedShopImages.findIndex((image) => image.id === i)
                        ].images[index].name,
                      url: items,
                    })),
                  ],
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
                  ...shopImageUrl[i].map((items, index) => ({
                    id: Math.random() + addedShopImages[i].images[index].name,
                    ImageName: addedShopImages[i].images[index].name,
                    url: items,
                  })),
                ],
              }
        );

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
        addedShopImagesDispatch,
        addedShopImages,
        mallImage,
        setMallImage,
        isLoading,
        setIsLoading,
      }}
    />
  );
};

export default MallForm;
