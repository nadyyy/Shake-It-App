// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Import Firestore and Auth services
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0ukYdbvfZVVYGRdWjgOh4jc5TNECaQfE",
  authDomain: "final-f193d.firebaseapp.com",
  projectId: "final-f193d",
  storageBucket: "final-f193d.appspot.com", // Corrected storage bucket
  messagingSenderId: "452883255312",
  appId: "1:452883255312:web:606419538670986ae57a95",
  measurementId: "G-GQBBK3FP8W" // Optional if you are using Firebase Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const firestore = getFirestore(app);
export const auth = getAuth(app);


export default firebaseConfig;
