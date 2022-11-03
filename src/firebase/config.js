import "firebase/storage";
import "firebase/firestore";
import firebase from "firebase/app";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,

  authDomain: process.env.REACT_APP_AUTH_DOMAIN,

  projectId: process.env.REACT_APP_PROJECT_ID,

  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,

  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,

  appId: process.env.REACT_APP_APP_ID,
};

// var firebaseConfig = {
//   apiKey: "AIzaSyDxkz-QHbVm4Wr2nUWAHmI07Q2UnEVUAxs",
//   authDomain: "shop-and-mall.firebaseapp.com",
//   projectId: "shop-and-mall",
//   storageBucket: "shop-and-mall.appspot.com",
//   messagingSenderId: "107193307561",
//   appId: "1:107193307561:web:4ac182c2fa9901d2ce74b8",
//   measurementId: "G-2RQTGJHNP2"
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const fireStore = firebase.firestore();
const storage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export { fireStore, storage, timestamp };
