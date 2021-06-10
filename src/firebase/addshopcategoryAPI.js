import { fireStore } from "./config";

export const addShopCategory = (category, subCategories) =>
  fireStore.collection("Shop Categories").add({
    category: category.category,
    rowContent: {
      rowData: subCategories.length > 0 ? subCategories : [],
    },
  });

export const deleteShopCategory = (data) =>
  fireStore.collection("Shop Categories").doc(data.id).delete();

export const editShopCategory = (category, subCategories) =>
  fireStore
    .collection("Shop Categories")
    .doc(category.id)
    .update({
      ...category,
      rowContent: {
        rowData: subCategories.length > 0 ? subCategories : [],
      },
    });
