// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

// 👇 Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBpdBPcjVyVh5IEyj9HSAYwbukzDbag5GA",
  authDomain: "carrent-8a642.firebaseapp.com",
  projectId: "carrent-8a642",
  storageBucket: "carrent-8a642.firebasestorage.app",
  messagingSenderId: "866736801591",
  appId: "1:866736801591:web:d48fe32aceebaee42afcb2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
