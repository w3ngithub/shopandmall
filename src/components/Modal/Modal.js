import React from "react";
import styles from "./modal.module.css";
import { ImCross } from "react-icons/im";

const Modal = ({ handleModal, handleDelete, content }) => {
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
        <ImCross className={styles.cross} onClick={handleModal} />
        <h1>Do you really want to Delete this item?</h1>
        <button
          onClick={() => {
            handleDelete(content);
          }}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export default Modal;
