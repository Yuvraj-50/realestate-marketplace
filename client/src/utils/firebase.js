// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-marketplace-8e188.firebaseapp.com",
  projectId: "realestate-marketplace-8e188",
  storageBucket: "realestate-marketplace-8e188.appspot.com",
  messagingSenderId: "170546994147",
  appId: "1:170546994147:web:79af22bb56e99d9484ded6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
