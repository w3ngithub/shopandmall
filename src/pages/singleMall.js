import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import Modal from "../components/single/Modal";
import { fireStore } from "../firebase/config";
import classes from "../styles/single.module.css";
import React, { useEffect, useState } from "react";
import SkeletonCard from "../skeletons/SkeletonCard";
import SkeletonText from "../skeletons/SkeletonText";
import SkeletonBlock from "../skeletons/SkeletonBlock";
import { useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import ShopCardComponent from "../components/shopCardComponent/ShopCardComponent";


const SingleMall = () => {
  const [mall, setMall] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const { id } = useParams();

  const docId = id.replace("_", " ");

  useEffect(() => {
    const unsubscribe =  
       fireStore
        .collection("Shopping Mall")
        .doc(docId)
        .onSnapshot((doc) => {
          setMall(doc.data());
          setLoading(false);
        });

    return ()=>{
      unsubscribe()
    }

  }, [docId]);

  return (
    <div className={classes.mainContainerMall}>
      {/* Modal */}
      {showModal === true && (
        <Modal {...{ setShowModal, docId, mall, toast }} />
      )}

      <div className={classes.topImage}>
        {loading ? (
          <SkeletonBlock />
        ) : (
          <img
            className={classes.image}
            src={mall?.mallImage?.imageUrl}
            alt=""
          />
        )}
      </div>

      <div className={classes.mainMall}>
        <div>
          {location.pathname.split("/")[1] === "admin" ? (
            <>
              <div className={classes.buttons}>
                <button
                  className={classes.addBtn}
                  onClick={() => setShowModal(true)}
                >
                  Add New Shop
                </button>
                <button
                  className={classes.editBtn}
                  onClick={() => {
                    history.push({
                      pathname: `/admin/editMall/${mall.mallName}`
                      //dataToSend: mall,
                    });
                  }}
                >
                  <FaEdit className={classes.editIcon} />
                  <span className={classes.text}>Edit</span>
                </button>
              </div>

              <div className={classes.buttonsMobile}>
                <button
                  className={classes.addBtn}
                  onClick={() => setShowModal(true)}
                >
                  <FaPlus />
                </button>
                <button
                  className={classes.editBtn}
                  onClick={() => {
                    // history.push({
                    //   pathname: `/admin/editMall/${mall.mallName}`,
                    //   dataToSend: mall,
                    // });
                    console.log(mall.mallName)
                    history.push(`/admin/editMall/${mall?.mallName}`)

                  }}
                >
                  <FaEdit className={classes.editIcon} />
                </button>
              </div>
            </>
          ) : (
            <div className={classes.break}></div>
          )}
        </div>

        <div
          style={{ borderBottom: "2px solid rgb(244,244,244)" }}
          className={classes.details}
        >
          {loading ? (
            <div style={{ marginTop: "60px" }}>
              <SkeletonText />
            </div>
          ) : (
            <h1>{mall?.mallName}</h1>
          )}
          {loading ? (
            <div style={{ marginTop: "3px" }}>
              <SkeletonText />
            </div>
          ) : (
            <p>
              <b>{mall.mallAddress}</b>
            </p>
          )}

          {loading ? (
            <div style={{ marginTop: "-10px", marginBottom: "-2px" }}>
              <SkeletonText />
            </div>
          ) : (
            <p>
              {mall?.timings?.map((time) => (
                <span key={time.id}>
                  {time.openTime} - {time.closeTime},
                </span>
              ))}
              <span>{!loading && `+977 - ${mall.phoneNumber}`}</span>
            </p>
          )}
        </div>

        <div className={classes.title}>
          <h3>Shops</h3>
        </div>

        {loading ? (
          <div className={classes.mallContainerSkeleton}>
            {[1, 2, 3, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : mall?.shops?.length > 0 ? (
          <div style={{ marginLeft: "-10px" }}>
            <ShopCardComponent malls={mall} single={true} />
          </div>
        ) : (
          <p className="mt-md">No shops added</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SingleMall;
