import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./addNewMallButton.module.css";

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
