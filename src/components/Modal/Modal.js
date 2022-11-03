import React from "react";
import styles from "./modal.module.css";
import { IoMdCloseCircle } from "react-icons/io";

const Modal = ({ handleModal, handleDelete, content, itemName }) => {
  return (
    <div
      className={styles.firstDiv}
      onClick={(e) => {
        handleModal();
      }}
    >
      <div
        className={styles.secondDiv}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IoMdCloseCircle className={styles.cross} onClick={handleModal} />
        <h1>Do you really want to Delete this item?</h1>
        <h3 style={{ color: "red" }}>(Selected Item Name: {itemName})</h3>
        <button
          onClick={() => {
            handleDelete(content);
          }}
        >
          Yes
        </button>
        <button onClick={handleModal} id={styles.cnclBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
