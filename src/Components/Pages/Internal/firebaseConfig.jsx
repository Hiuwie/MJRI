// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


// firebaseConfig.js

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5lcY-AwE4LHJxJ-sP6-KjWZxdyHbUBOw",
  authDomain: "availability-calender-417fc.firebaseapp.com",
  projectId: "availability-calender-417fc",
  storageBucket: "availability-calender-417fc.firebasestorage.app",
  messagingSenderId: "642980814494",
  appId: "1:642980814494:web:4bf77342ab4052f8c1258f",
  measurementId: "G-CNJ3EG1TYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);


export { db };
export { auth };