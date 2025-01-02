// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };




// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// // Your web app's Firebase configuration
// // const firebaseConfig = {
// //     apiKey: process.env.REACT_APP_API_KEY,
// //     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
// //     projectId: process.env.REACT_APP_PROJECT_ID,
// //     storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
// //     messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
// //     appId: process.env.REACT_APP_APP_ID,
// //     measurementId: process.env.REACT_APP_MEASUREMENT_ID
// //   };


// const firebaseConfig = {
//     apiKey: import.meta.env.REACT_APP_API_KEY,
//     authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
//     projectId: import.meta.env.REACT_APP_PROJECT_ID,
//     storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID,
//     appId: import.meta.env.REACT_APP_APP_ID,
//     measurementId: import.meta.env.REACT_APP_MEASUREMENT_ID
//   };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();

// export { auth, googleProvider, signInWithPopup };