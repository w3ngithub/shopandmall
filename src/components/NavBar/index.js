import Nav from "./Nav";
import Drawer from "./Drawer";
import React, { useState, useEffect } from "react";
import useFirestore from "../../hooks/useFirestore";
const Try = ({ setShowSearchExtended }) => {
  let { docs } = useFirestore("Shop Categories");

  const [arr, setArr] = useState([]);

  let check = localStorage.getItem("isAuth");
  let username = localStorage.getItem("username");
  const [allUsers, setAllUsers] = useState([]);
  const userDocs = useFirestore("users").docs;

  useEffect(() => {
    const transformedData = [
      ...userDocs.map((data) => ({
        ...data,
      })),
    ];
    setAllUsers(transformedData);
  }, [userDocs]);
  useEffect(() => {
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
