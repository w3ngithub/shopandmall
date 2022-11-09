import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SkeletonText from "../skeletons/SkeletonText";
import UserModal from "../components/createUserComponent/AddUserModal";
import { fireStore } from "../firebase/config";
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
    const response = window.confirm("Are you sure?");
    if (response) {
      deleteUser(data);
      deleteNotification();
    }
  };
  const handleAddUserSubmit = (data) => {
    addUser(data);
    successNotification();
    setShowAddModal(false);
  };
  const handleEditUserSubmit = (data) => {
    const updatedUser = { id: userID, ...data };
    editUser(updatedUser);
    editNotification();
    setShowEditModal(false);
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
    toast.info("User Edit Succesfully!", {
      position: "bottom-right",
      autoClose: 1500,
      onClose: () => history.go(0),
    });

  return (
    <>
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
              { headerText: "Users", field: "Username" },
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
            }}
            handleDeleteClick={handleDelete}
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
          />
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default CreateUser;
