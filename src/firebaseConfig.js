import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpdBPcjVyVh5IEyj9HSAYwbukzDbag5GA",
  authDomain: "carrent-8a642.firebaseapp.com",
  projectId: "carrent-8a642",
  storageBucket: "carrent-8a642.firebasestorage.app",
  messagingSenderId: "866736801591",
  appId: "1:866736801591:web:d48fe32aceebaee42afcb2"
};

const app = initializeApp(firebaseConfig);

// ✅ Export these so other files can import them
export const auth = getAuth(app);
export const db = getFirestore(app);