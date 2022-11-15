import Nav from "./Nav";
import Drawer from "./Drawer";
import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";
import { fireStore } from "../../firebase/config";

const Try = ({ setShowSearchExtended }) => {
  let { docs } = useFirestore("Shop Categories");

  const [arr, setArr] = useState([]);

  let check = localStorage.getItem("isAuth");
  let username = localStorage.getItem("username");
  const [allUsers, setAllUsers] = useState([]);
  React.useEffect(() => {
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
      });
    // return cleanup function
    return () => subscriber();
  }, []);
  React.useEffect(() => {
    const mainData = docs.map(({ id, category, rowContent }) => {
      return {
        id,
        category,
        data: rowContent.rowData.map((row) => row.subCategory),
      };
    });
    setArr(mainData);
  }, [docs]);
  return (
    <div>
      <Nav
        check={check}
        setShowSearchExtended={setShowSearchExtended}
        username={username}
        allUsers={allUsers}
      />
      <Drawer
        data={arr}
        check={check}
        setShowSearchExtended={setShowSearchExtended}
        username={username}
      />
    </div>
  );
};

export default Try;
