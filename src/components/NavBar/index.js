import React, { useState } from "react";
import Nav from "./Nav";
import Drawer from "./Drawer";
import useFirestore from "../../hooks/useFirestore";

const Try = ({ setShowSearchExtended }) => {
  let { docs } = useFirestore("Shop Categories");

  const [arr, setArr] = useState([]);

  let check = localStorage.getItem("isAuth");

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
      <Nav check={check} setShowSearchExtended={setShowSearchExtended} />
      <Drawer
        data={arr}
        check={check}
        setShowSearchExtended={setShowSearchExtended}
      />
    </div>
  );
};

export default Try;
