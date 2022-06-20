import React from 'react'
import styles from './modal.module.css'
import { storage,fireStore } from '../../firebase/config'

const Modal = ({hanldeModal,doc}) => {
    const handleDelete = () =>{
        let storageRef = storage.ref();
        let mallImageDel = storageRef.child(doc.mallImage.imageName);
    
        //Shop Images
        doc.shops.map((shop) =>
        shop.shopImages.map((s) =>
            storageRef
            .child(s.id)
            .delete()
            .then(() => "Images Deleted SuccessFUlly")
            .catch((err) => "Images Not Deleted")
        )
        );
    
        //Deleting Images
        mallImageDel
        .delete()
        .then(() => "Images Deleted SuccessFUlly")
        .catch((err) => "Images Not Deleted");
    
        //shop video
        doc.shops.forEach((shop) => {
        if (shop.shopVideo) {
            storageRef
            .child(shop.shopVideo.id)
            .delete()
            .then(() => console.log("deleted video"));
        }
        });
        //video thumbnail
        doc.shops.forEach((shop) => {
        if (shop.shopVideo) {
            storageRef
            .child(shop.shopVideo.thumbnail.id)
            .delete()
            .then(() => console.log("deleted Thumbnail"));
        }
        });
        fireStore
        .collection("Shopping Mall")
        .doc(doc.mallName)
        .delete()
        .then(() => console.log("DELETED Successfully"))
        .catch((error) => console.log("Error deleting mall"));

      }
  return (
    <div className={styles.firstDiv} onClick={(e)=>{e.stopPropagation(); hanldeModal()}}>
        <div className={styles.secondDiv} onClick={(e)=>e.stopPropagation()}>
            <h1>Are you Sure?</h1>
            <button onClick={handleDelete}>Yes</button>
        </div>
    </div>
  )
}

export default Modal