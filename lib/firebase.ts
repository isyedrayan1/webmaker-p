import { getApps, initializeApp, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdbvKwlZAY7Vjnvh1MvLi-b_LX3Z4yKFQ",
  authDomain: "webmaker-mheim.firebaseapp.com",
  projectId: "webmaker-mheim",
  storageBucket: "webmaker-mheim.firebasestorage.app",
  messagingSenderId: "255884653509",
  appId: "1:255884653509:web:d9547ceac2f9ebe3a191ac",
};

// Initialize Firebase (singleton pattern for Next.js hot reloads)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Realtime Database (JSON Tree Database)
export const db = getDatabase(app);

// Firestore (Document Database)
export const firestore = getFirestore(app);
