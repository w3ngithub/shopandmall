import { fireStore, storage } from "./config";

export const addUser = (data) => {
  try {
    fireStore
      .collection("users")
      .add({ ...data })
      .then((doc) => {
        console.log(doc);
      })
      .catch(() => alert("Error adding user"));
  } catch (err) {
    alert(err);
  }
};

export const deleteUser = (data) => {
  if (data.imageURL === undefined || data.imageURL === null) {
    fireStore.collection("users").doc(data.id).delete();
    return;
  } else {
    storage.refFromURL(data?.imageURL).delete();
    fireStore.collection("users").doc(data.id).delete();
    return;
  }
};

export const editUser = ({ id, data, userImage }) => {
  fireStore
    .collection("users")
    .doc(id)
    .get()
    .then(async (doc) => {
      if (userImage) {
        if (userImage.name === doc.data().image) {
          fireStore.collection("users").doc(id).update({
            Username: data.Username,
            Password: data.Password,
            Role: data.Role,
            image: doc.data().image,
            imageURL: doc.data().imageURL,
          });
        } else {
          if (doc.data().image) {
            storage.refFromURL(doc.data().imageURL).delete();
          }
          const storageRef = storage.ref();
          let userImageUrl = null;
          const imageRef = storageRef.child(Date.now() + userImage.name);
          await imageRef.put(userImage);
          userImageUrl = await imageRef.getDownloadURL();
          fireStore.collection("users").doc(id).update({
            Username: data.Username,
            Password: data.Password,
            Role: data.Role,
            image: userImage.name,
            imageURL: userImageUrl,
          });
        }
      } else {
        if (doc.data().image) {
          storage.refFromURL(doc.data().imageURL).delete();
        }
        fireStore.collection("users").doc(id).update({
          Username: data.Username,
          Password: data.Password,
          Role: data.Role,
          image: null,
          imageURL: null,
        });
      }
    });
};
