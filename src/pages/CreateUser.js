import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SkeletonText from "../skeletons/SkeletonText";
import UserModal from "../components/createUserComponent/AddUserModal";
import { fireStore, storage } from "../firebase/config";
import styles from "../styles/addShopCategories.module.css";
import Button from "../components/Button/Button";
import Table from "../components/table";
import { addUser, deleteUser, editUser } from "../firebase/manageUserAPI";

const CreateUser = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [userID, setUserID] = useState([]);
  const [userImageError, setUserImageError] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm({ defaultValues: { Username: "", Password: "pass1234" } });
  useEffect(() => {
    const getUsersFromFirebase = [];
    const subscriber = fireStore
      .collection("users")
      .orderBy("Username")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getUsersFromFirebase.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setAllUsers(getUsersFromFirebase);
        setLoading(false);
      });

    // return cleanup function
    return () => subscriber();
  }, [loading]);
  const handleDelete = (data) => {
    deleteUser(data);
    deleteNotification();
  };
  const [userImage, setUserImage] = useState("");
  const types = ["image/jpeg", "image/png"];
  const userImageHandler = (e) => {
    setUserImage(null);
    for (let i = 0; i < e.target.files.length; i++) {
      let selectedUserImage = e.target.files[i];

      if (selectedUserImage && types.includes(selectedUserImage.type)) {
        setUserImage(selectedUserImage);
        setUserImageError(null);
      } else {
        setUserImageError("Please select an image file (jpeg or png)");
      }
    }
  };
  const handleAddUserSubmit = async (data) => {
    if (userImageError === null) {
      const storageRef = storage.ref();
      let userImageUrl = null;
      if (userImage !== null) {
        const imageRef = storageRef.child(Date.now() + userImage.name);
        await imageRef.put(userImage);
        userImageUrl = await imageRef.getDownloadURL();
        const userData = {
          ...data,
          image: userImage.name,
          imageURL: userImageUrl,
        };
        addUser(userData);
      } else {
        const userData = { ...data };
        addUser(userData);
      }
      successNotification();
      setShowAddModal(false);
    }
  };
  const handleEditUserSubmit = (data) => {
    if (userImageError === null) {
      const updatedUser = {
        id: userID,
        data,
        userImage,
      };
      editUser(updatedUser);
      editNotification();
      setShowEditModal(false);
    }
  };
  const successNotification = () =>
    toast.success("User Added Succesfully!", {
      position: "bottom-right",
      autoClose: 1500,
      onClose: () => history.go(0),
    });
  const deleteNotification = () =>
    toast.info("User Deleted Succesfully!", {
      position: "bottom-right",
      autoClose: 1500,
      onClose: () => history.go(0),
    });
  const editNotification = () =>
    toast.info("User Edited Succesfully!", {
      position: "bottom-right",
      autoClose: 1500,
      onClose: () => history.go(0),
    });

  return (
    <div className={styles.container}>
      <h1>Users</h1>
      <Button onClick={() => setShowAddModal(true)} type="button">
        Add New User
      </Button>

      {loading ? (
        [1, 2, 3].map((n) => <SkeletonText key={n} />)
      ) : (
        <Table
          rowData={allUsers}
          fields={[
            { headerText: "Username", field: "Username" },
            { headerText: "Password", field: "Password" },
            { headerText: "Role", field: "Role" },
          ]}
          onClick={() => {}}
          width={50}
          hasAction={true}
          isNestedTable={false}
          handleEditClick={(data) => {
            setValue("Username", data.Username);
            setValue("Password", data.Password);
            setValue("Role", data.Role);
            setShowEditModal(true);
            setUserID(data.id);
            if (
              data.image
                ? setUserImage({ name: data.image })
                : setUserImage(null)
            );
          }}
          handleDelete={handleDelete}
        />
      )}
      {(showAddModal || showEditModal) && (
        <UserModal
          errors={errors}
          showEditModal={showEditModal}
          register={register}
          handleSubmit={handleSubmit}
          setShowModal={() =>
            showAddModal ? setShowAddModal(false) : setShowEditModal(false)
          }
          onSubmit={
            showAddModal
              ? handleSubmit(handleAddUserSubmit)
              : handleSubmit(handleEditUserSubmit)
          }
          reset={reset}
          allUsers={allUsers}
          getValues={getValues}
          userImageError={userImageError}
          setUserImageError={setUserImageError}
          userImageHandler={userImageHandler}
          userImage={userImage}
          setUserImage={setUserImage}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default CreateUser;
