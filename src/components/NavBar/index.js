import Nav from "./Nav";
import Drawer from "./Drawer";
import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";

const Try = ({ setShowSearchExtended }) => {
  let { docs } = useFirestore("Shop Categories");

  const [arr, setArr] = useState([]);

  let check = localStorage.getItem("isAuth");
  let username = localStorage.getItem("username");

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
