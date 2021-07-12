import React from "react";
import classes from "./addNewMallButton.module.css";
import { useHistory } from "react-router-dom";

const AddNewMallButton = () => {
  const history = useHistory();

  return (
    <div>
      <button
        className={classes.addBtn}
        onClick={() =>
          history.push({
            pathname: "/admin/newMall",
          })
        }
      >
        Add New Mall
      </button>
    </div>
  );
};

export default AddNewMallButton;
