// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2e0d7.firebaseapp.com",
  projectId: "mern-blog-2e0d7",
  storageBucket: "mern-blog-2e0d7.appspot.com",
  messagingSenderId: "853206888336",
  appId: "1:853206888336:web:50650b0e63bf40e2308d15"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);