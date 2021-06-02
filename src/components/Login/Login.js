import classes from "./login.module.css";
import { fireStore } from "../../firebase/config";
import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";

const LoginForm = ({ setIsAuth }) => {
  const history = useHistory();

  const initialData = {
    username: "",
    password: "",
    errors: "",
  };

  //States
  const [userData, setUserData] = useState([]);
  const [inputData, setInputData] = useState(initialData);

  //Destructure
  const { username, password, errors } = inputData;

  //Fetch Data from Firebase
  const fetchData = async () => {
    let documents = [];
    const response = fireStore.collection("users");
    const data = await response.get();
    data.docs.forEach((doc) => documents.push(doc.data()));
    setUserData(documents);
  };

  useEffect(() => {
    fetchData();
    // () => {}
  }, []);

  //On Form Submit
  const submitHandler = (e) => {
    e.preventDefault();
    userData.forEach((data) => {
      if (username === data.Username && password === data.Password) {
        localStorage.setItem("isAuth", "true");
        setIsAuth(localStorage.getItem("isAuth"));
        localStorage.setItem("username", username);
        history.push("/admin/dashboard");
      } else {
        setInputData({
          ...inputData,
          errors: "Username or Password didn't match",
        });
      }
    });
  };

  //On input value change
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h3 className={classes.header}>Login</h3>
        <form onSubmit={submitHandler} className={classes.form}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={changeHandler}
            className={classes.input}
          />
          <input
            type="text"
            placeholder="Password"
            name="password"
            value={password}
            onChange={changeHandler}
            className={classes.input}
          />
          {errors && (
            <p style={{ color: "red", textAlign: "center" }}>{errors}</p>
          )}
          <input type="submit" value="Login" className={classes.submit} />
        </form>
      </div>
    </div>
  );
};

const Login = (props) => {
  const { isAuth } = props;
  return (
    <>
      {isAuth === "true" ? (
        <Redirect to={{ pathname: "/admin/dashboard" }} />
      ) : (
        <LoginForm {...props} />
      )}
    </>
  );
};

export default Login;
