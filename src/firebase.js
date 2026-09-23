import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDaLG2RAs9vpcvuWs9HZwupgZ2XTl1q4QQ",
  authDomain: "speakio-e10e7.firebaseapp.com",
  projectId: "speakio-e10e7",
  storageBucket: "speakio-e10e7.firebasestorage.app",
  messagingSenderId: "120754389397",
  appId: "1:120754389397:web:d089d6e3d4663c7312f69c",
  measurementId: "G-7Z99VD9DLW"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);