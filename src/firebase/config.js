import "firebase/storage";
import "firebase/firestore";
import firebase from "firebase/app";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAtQ9jVPG8-vr-PYJsRbZojAQhDc7RWlik",
  authDomain: "shopping-mall-67399.firebaseapp.com",
  projectId: "shopping-mall-67399",
  storageBucket: "shopping-mall-67399.appspot.com",
  messagingSenderId: "26390021620",
  appId: "1:26390021620:web:bc1f2c765282cd1e1765a1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const fireStore = firebase.firestore();
const storage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export { fireStore, storage, timestamp };
