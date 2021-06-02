import CommonForm from "./CommonForm";
import editReducer from "../../reducers/editReducer";
import { useHistory, useLocation } from "react-router-dom";
import { storage, fireStore } from "../../firebase/config";
import React, { useState, useReducer } from "react";
import addedShopImagesReducer from "../../reducers/addedShopImagesReducer";

const MallForm = () => {
  //Removed Images
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const edit = true;

  const history = useHistory();
  const location = useLocation();

  //States
  const [editData, editDispatch] = useReducer(editReducer, location.dataToSend);
  const [mallImage, setMallImage] = useState(null);

  //Added Images
  const shopImageValues = [{ id: 0, images: [] }];

  const [addedShopImages, addedShopImagesDispatch] = useReducer(
    addedShopImagesReducer,
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
        //delete old image
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

      await Promise.all(
        addedShopImages.map((image) =>
          Promise.all(
            image.images.map((img) => storage.ref().child(img.name).put(img))
          )
        )
      );

      const shopImageUrl = await Promise.all(
        addedShopImages.map((image) =>
          Promise.all(
            image.images.map((img) => storage.ref(img.name).getDownloadURL())
          )
        )
      );

      //Remove Shop Images from Firebase Storage
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
        mallImage: setMallImage,
      };

      let shops = editData?.shops?.map((s, i) =>
        s.shopImages
          ? shopImageUrl[i]
            ? {
                id: i,
                shopName: s.shopName,
                shopDescription: s.shopDescription,
                shopImages: [
                  ...s.shopImages,
                  ...shopImageUrl[i].map((items, index) => ({
                    id: Math.random() + addedShopImages[i].images[index].name,
                    ImageName: addedShopImages[i].images[index].name,
                    url: items,
                  })),
                ],
              }
            : {
                id: i,
                shopName: s.shopName,
                shopDescription: s.shopDescription,
                shopImages: [...s.shopImages],
              }
          : {
              id: i,
              shopName: s.shopName,
              shopDescription: s.shopDescription,
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
      history.push("/admin/malls");
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
