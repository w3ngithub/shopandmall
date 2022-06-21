import React from 'react'
import styles from './modal.module.css'
import {ImCross} from 'react-icons/im'

const Modal = ({hanldeModal,handleDelete}) => {
    
  return (
    <div className={styles.firstDiv} onClick={(e)=>{e.stopPropagation();hanldeModal()}}>
        <div className={styles.secondDiv} onClick={e=>e.stopPropagation()}>
            <ImCross className={styles.cross} onClick={hanldeModal}/>
            <h1>Do you really want to Delete this item?</h1>
            <button onClick={handleDelete}>Yes</button>
        </div>
    </div>
  )
}

export default Modal