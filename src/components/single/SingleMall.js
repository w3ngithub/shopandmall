import Modal from "./Modal";
import { useHistory } from "react-router-dom";
import classes from "./singleMall.module.css";
import { fireStore } from "../../firebase/config";
import React, { useEffect, useState } from "react";
import cls from "../Dashboard/dashboard.module.css";
import { useParams, useLocation } from "react-router-dom";

const SingleMall = () => {
  const [mall, setMall] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const { id } = useParams();
  const docId = id.replace("_", " ");

  useEffect(() => {
    const fetchData = async () => {
      await fireStore
        .collection("Shopping Mall")
        .doc(docId)
        .onSnapshot((doc) => setMall(doc.data()));
    };

    fetchData();
  }, [docId]);

  return (
    <div className={classes.container}>
      {/* Modal */}
      {showModal === true && <Modal {...{ setShowModal, docId, mall }} />}
      <div className={classes.wrapper}>
        <div className={classes.name}>
          <h1 className={classes.title}>{mall.mallName}</h1>
          <h4>{mall.mallAddress}</h4>
        </div>

        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src={mall?.mallImage?.imageUrl}
            alt=""
          />
        </div>

        <div className={(cls.main, classes.main)}>
          <div>
            {location.pathname.split("/")[1] === "admin" ? (
              <div className={classes.buttons}>
                <button
                  className={cls.addBtn}
                  onClick={() => setShowModal(true)}
                >
                  Add New Shop
                </button>
                <button
                  className={classes.editBtn}
                  onClick={() => {
                    history.push({
                      pathname: "/admin/editMall",
                      dataToSend: mall,
                    });
                  }}
                >
                  <i className="fas fa-edit "></i>
                  <span className={classes.text}>Edit</span>
                </button>
              </div>
            ) : (
              <div className={classes.break}></div>
            )}
          </div>

          <div className={classes.mallContainer}>
            <div className={classes.header}>
              <h4 className={cls.heading}>Shops</h4>
            </div>

            {mall.shops && mall?.shops?.length > 0 ? (
              <div className={cls.container}>
                {mall.shops &&
                  mall?.shops?.map((shop, index) => (
                    <div className={cls.wrapper} key={index}>
                      {shop.shopImages &&
                        shop.shopImages.map(
                          (s, i) =>
                            i === 0 && (
                              <div
                                key={i}
                                className={cls.imageContainer}
                                onClick={() =>
                                  location.pathname.split("/")[1] === "admin"
                                    ? history.push(
                                        "/admin/" +
                                          mall.mallName +
                                          "/shops/" +
                                          shop.shopName
                                      )
                                    : history.push(
                                        "/mall/" +
                                          mall.mallName +
                                          "/shops/" +
                                          shop.shopName
                                      )
                                }
                              >
                                <img
                                  className={cls.image}
                                  key={i}
                                  src={s.url}
                                  alt="thumbnails"
                                />
                              </div>
                            )
                        )}
                      <h3>{shop.shopName}</h3>
                    </div>
                  ))}
              </div>
            ) : (
              <h3>No Shops Yet</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMall;
