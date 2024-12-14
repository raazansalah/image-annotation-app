import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Authentication

const firebaseConfig = {
  apiKey: "AIzaSyBU41qvz3zg4slG0p72yG4gE1NqemfrRHU",
  authDomain: "image-annotation-tool-387c5.firebaseapp.com",
  projectId: "image-annotation-tool-387c5",
  storageBucket: "image-annotation-tool-387c5.firebasestorage.app",
  messagingSenderId: "48970135641",
  appId: "1:48970135641:web:cfa8fd761513b69c039948",
  measurementId: "G-8DFT941S9E",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Authentication

export { db, auth };
