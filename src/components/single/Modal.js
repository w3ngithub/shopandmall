import classes from "./modal.module.css";
import React, { useState, useEffect } from "react";
import { fireStore, storage } from "../../firebase/config";

const Modal = ({ setShowModal, docId, mall }) => {
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setIsLoading(false), []);

  const [shop, setShop] = useState({
    shopName: "",
    shopDescription: "",
    shopImages: [{ id: "", imageName: "", url: "" }],
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setShop({
      ...shop,
      [name]: value,
    });
  };

  const types = ["image/jpeg", "image/png"];

  const shopImageHandler = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      let selectedShopImages = e.target.files[i];

      if (selectedShopImages && types.includes(selectedShopImages.type)) {
        setImages((prevState) => [...prevState, selectedShopImages]);
      } else {
        setErrors("Please select an image file  (jpeg or png)");
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Promise.all(
        images.map((image) => storage.ref(image.name).put(image))
      );

      const shopImageUrl = await Promise.all(
        images.map((image) => storage.ref(image.name).getDownloadURL())
      );

      let result = {
        id: Math.random(),
        shopName: shop.shopName,
        shopDescription: shop.shopDescription,
        shopImages: shopImageUrl.map((items, index) => ({
          id: Math.random() + images[index].name,
          ImageName: images[index].name,
          url: items,
        })),
      };

      //FireStore
      mall.shops
        ? fireStore
            .collection("Shopping Mall")
            .doc(docId)
            .set({
              ...mall,
              shops: [...mall.shops, result],
            })
        : fireStore
            .collection("Shopping Mall")
            .doc(docId)
            .set({
              ...mall,
              result,
            });
    } catch {}

    setShowModal(false);
  };

  return (
    <div>
      <div
        className={classes.modalBackground}
        onClick={() => {
          setShowModal(false);
        }}
      ></div>
      <div className={classes.modal}>
        <h3 className={classes.title}>Add New Shop</h3>

        <form onSubmit={onSubmitHandler} className={classes.form}>
          <input
            type="text"
            placeholder="Name of Shop"
            name="shopName"
            onChange={onChangeHandler}
            className={classes.input}
          />
          <textarea
            rows="4"
            cols="50"
            type="text"
            placeholder="Description"
            name="shopDescription"
            onChange={onChangeHandler}
            className={classes.input}
          />

          {errors && <p>{errors}</p>}
          <label className={classes.label}>
            <input
              className={classes.upload}
              multiple
              type="file"
              onChange={shopImageHandler}
            />
            <span>
              <i className="far fa-plus-circle"></i>
            </span>
          </label>

          <div className={classes.selectedImages}>
            {images &&
              images.map((image, ind) => (
                <p key={ind} className={classes.image}>
                  {image.name}
                </p>
              ))}
          </div>

          <input
            className={isLoading ? classes.submitBtnOnLoad : classes.submitBtn}
            type="submit"
            value={isLoading ? "Loading..." : "Save"}
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;
