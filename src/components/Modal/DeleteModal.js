import React from "react";
import ReactDOM from "react-dom";
import Modal from "./Modal";

const DeleteModal = ({ datas }) => {
  return ReactDOM.createPortal(
    <Modal {...datas} />,
    document.getElementById("modal")
  );
};

export default DeleteModal;
