// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYqzHGq6prRpleFbYC4dj9Sb7iQsc9dB4",
  authDomain: "spt-crackers.firebaseapp.com",
  databaseURL: "https://spt-crackers-default-rtdb.firebaseio.com",
  projectId: "spt-crackers",
  storageBucket: "spt-crackers.firebasestorage.app",
  messagingSenderId: "762955873779",
  appId: "1:762955873779:web:2e9b9009ec25d93ba6e686",
  measurementId: "G-HQYC06ZTWV"
  // apiKey: "AIzaSyBfY0rbRBWi3L6bm1DJ99htoOOPrhD0jgw",
  // authDomain: "bullsstoreeasy-45b70.firebaseapp.com",
  // databaseURL: "https://bullsstoreeasy-45b70-default-rtdb.firebaseio.com",
  // projectId: "bullsstoreeasy-45b70",
  // storageBucket: "bullsstoreeasy-45b70.appspot.com",
  // messagingSenderId: "902555612373",
  // appId: "1:902555612373:web:232bdef53cad1a68545e5c",
  // measurementId: "G-3YZ9GT0JSE"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getDatabase(app);
export const storage = getStorage(app);





