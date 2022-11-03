import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SkeletonText from "../skeletons/SkeletonText";
import { fireStore } from "../firebase/config";
import classes from "../styles/createUser.module.css";

const CreateUser = () => {
  const [userName, setUserName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const username = register("username", {
    required: true,
    minLength: 4,
  });
  useEffect(() => {
    const getUsersFromFirebase = [];
    const subscriber = fireStore
      .collection("users")
      .orderBy("username")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getUsersFromFirebase.push({
            ...doc.data(),
          });
        });
        setAllUsers(getUsersFromFirebase);
        setLoading(false);
      });

    // return cleanup function
    return () => subscriber();
  }, [loading]);
  const changeHandler = (e) => {
    setUserName(e.target.value);
  };
  const successNotification = () =>
    toast.success("User Added Succesfully!", {
      position: "bottom-right",
      autoClose: 2000,
      onClose: () => history.goBack(),
    });
  const submitHandler = (data) => {
    try {
      fireStore
        .collection("users")
        .doc(data.username)
        .set({ id: Math.random(Date.now()), ...data })
        .then(() => {
          successNotification();
        })
        .catch(() => console.log("Error adding user"));
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className={classes.mainContainer}>
        <h2 className={classes.mallTitle}>New User Form</h2>
        <div className={classes.formContainer}>
          <form
            className={classes.form}
            action=""
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className={classes.innerDiv}>
              <div>
                <label htmlFor="">User's Name: </label>
                <input
                  type="text"
                  placeholder="User Name"
                  name="username"
                  value={userName}
                  onChange={(e) => {
                    changeHandler(e);
                    username.onChange(e);
                  }}
                  className={classes.input}
                />
                {errors?.username?.type === "required" && (
                  <p className={classes.error}>* User Name is required</p>
                )}
                {errors?.username?.type === "minLength" && (
                  <p className={classes.error}>
                    * User Name should be more than 4 characters
                  </p>
                )}
              </div>
            </div>
            <br />
            <h3>Below are the list of users that exist in the database:</h3>
            <br />
            {loading ? (
              [1, 2, 3].map((n) => <SkeletonText key={n} />)
            ) : (
              <>
                {allUsers.length > 0 ? (
                  <>
                    {allUsers.map((user, index) => {
                      return (
                        <li key={index}>{user.username || user.Username}</li>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <p>No data found!</p>
                  </>
                )}
              </>
            )}
            <br />
            <hr />
            <br />
            <input className={classes.submitBtn} type="submit" value={"Save"} />
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default CreateUser;
