import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF8jHouVNAkhbZosdbDA1dp5z_R4qwxEw",
  authDomain: "quasartodolist-ed31d.firebaseapp.com",
  projectId: "quasartodolist-ed31d",
  storageBucket: "quasartodolist-ed31d.appspot.com",
  messagingSenderId: "1045809811653",
  appId: "1:1045809811653:web:e0176480768da7656d60ac",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebaseApp.firestore();

export default db;
