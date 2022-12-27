import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import SkeletonText from "../skeletons/SkeletonText";
import UserModal from "../components/createUserComponent/AddUserModal";
import { storage } from "../firebase/config";
import styles from "../styles/addShopCategories.module.css";
import Button from "../components/Button/Button";
import Table from "../components/table";
import { addUser, deleteUser, editUser } from "../firebase/manageUserAPI";
import useFirestore from "../hooks/useFirestore";

const CreateUser = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userID, setUserID] = useState([]);
  const [userImageError, setUserImageError] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm({ defaultValues: { Username: "", Password: "pass1234" } });
  const { docs, loading } = useFirestore("users");

  useEffect(() => {
    const transformedData = [
      ...docs.map((data) => ({
        ...data,
      })),
    ];
    setAllUsers(transformedData);
  }, [docs]);

  const handleDelete = (data) => {
    deleteUser(data);
    deleteNotification();
  };
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
      if (!userImage) {
        const userData = { ...data };
        addUser(userData);
      } else {
        const imageRef = storageRef.child(Date.now() + userImage.name);
        await imageRef.put(userImage);
        userImageUrl = await imageRef.getDownloadURL();
        const userData = {
          ...data,
          image: userImage.name,
          imageURL: userImageUrl,
        };
        addUser(userData);
      }
      successNotification();
      setShowAddModal(false);
      reset();
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
      reset();
    }
  };
  const successNotification = () =>
    toast.success("User Added Succesfully!", {
      position: "bottom-right",
      autoClose: 1500,
    });
  const deleteNotification = () =>
    toast.info("User Deleted Succesfully!", {
      position: "bottom-right",
      autoClose: 1500,
    });
  const editNotification = () =>
    toast.info("User Edited Succesfully!", {
      position: "bottom-right",
      autoClose: 1500,
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
