import { fireStore } from "./config";

export const addUser = (data) => {
  try {
    fireStore
      .collection("users")
      .add({ ...data })
      .then((doc) => {
        console.log(doc);
      })
      .catch(() => console.log("Error adding user"));
  } catch (err) {
    alert(err);
  }
};

export const deleteUser = (data) => {
  fireStore.collection("users").doc(data.id).delete();
};

export const editUser = (updatedUser) => {
  fireStore.collection("users").doc(updatedUser.id).update({
    Username: updatedUser.Username,
    Password: updatedUser.Password,
    Role: updatedUser.Role,
  });
};
