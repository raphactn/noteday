import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-owfDw5qfx84Vw7OzkOfYugAJJf0rBbw",
  authDomain: "noteday-94921.firebaseapp.com",
  projectId: "noteday-94921",
  storageBucket: "noteday-94921.appspot.com",
  messagingSenderId: "962666499297",
  appId: "1:962666499297:web:4c6b3928c46ba6308e7ba0",
  measurementId: "G-FRFDS3VMS1"
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)
export const auth = getAuth(app)